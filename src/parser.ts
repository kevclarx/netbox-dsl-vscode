import * as vscode from 'vscode';

// Example dsl syntax
//
// sites {
//   name: Ashburn
//   slug: as
//   region: None
// }

// racks {
//   br11: { site: as, region: east, ru: 42, role: rdei-compute, create: true }
//   br120: fetch(name="br120")
// }
//

interface ASTNode {
    type: string;
}

interface RackNode extends ASTNode {
    name: string;
    properties: Record<string, any>;
}

interface SiteNode extends ASTNode {
    name: string;
    properties: Record<string, any>;
}

export class Parser {
    private tokens: string[] = [];
    private currentToken: string = '';
    private index: number = -1;

    constructor() {
    }

    private tokenize(inputString: string): string[] {
        const tokens = inputString
            .replace("{", " { ")
            .replace("}", " } ")
            .replace(":", " : ")
            .replace(",", " , ")
            .split(" ")
            .filter((token) => token !== "");
        return tokens;
    }

    private advance(): string {
        this.index += 1;
        if (this.index < this.tokens.length) {
            return this.tokens[this.index];
        } else {
            return "";
        }
    }

    public parseAndDisplay(document: vscode.TextDocument): void {
        const inputString = document.getText();
        this.tokens = this.tokenize(inputString);
        this.advance();
        const ast = this.parse(inputString);

        // Do something with the AST, such as displaying it in the output or using it for further processing
        console.log(ast);
    }

    public parse(inputString: string): ASTNode[] {
        const result: ASTNode[] = [];
        while (this.currentToken !== "") {
            const sectionName = this.currentToken;
            this.advance();
            if (this.currentToken !== "{") {
                throw new SyntaxError('Expected "{"');
            }
            this.currentToken = this.advance();
            const sectionProperties = this.parseSectionProperties(this.currentToken); // Pass currentToken as parameter
            if (sectionName === "racks") {
                const rackNodes: RackNode[] = [];
                for (const [rackName, properties] of Object.entries(sectionProperties)) {
                    rackNodes.push({
                        type: "rack",
                        name: rackName,
                        properties: properties as Record<string, any>,
                    });
                }
                result.push(...rackNodes);
            } else if (sectionName === "sites") {
                const siteNodes: SiteNode[] = [];
                for (const [siteName, properties] of Object.entries(sectionProperties)) {
                    siteNodes.push({
                        type: "site",
                        name: siteName,
                        properties: properties as Record<string, any>,
                    });
                }
                result.push(...siteNodes);
            }
            if (this.currentToken !== "}") {
                throw new SyntaxError('Expected "}"');
            }
            this.currentToken = this.advance();
        }
        return result;
    }

    private parseSectionProperties(startToken: string): Record<string, any> {
        const properties: Record<string, any> = {};
        let currentToken = startToken;
        while (currentToken !== "," && currentToken !== "}") {
            const propertyName = currentToken;
            this.currentToken = this.advance();
            if (this.currentToken !== ":") {
                throw new SyntaxError('Expected ":"');
            }
            this.currentToken = this.advance();
            let propertyValue: any;
            if (this.currentToken.startsWith('"')) {
                propertyValue = this.currentToken.replace(/"/g, "");
            } else if (this.currentToken.startsWith("fetch")) {
                propertyValue = this.parseFetchFunction();
            } else {
                propertyValue = this.currentToken;
            }
            properties[propertyName] = propertyValue;
            currentToken = this.currentToken; // Update the currentToken variable
            this.currentToken = this.advance();
        }
        return properties;
    }

    private parseFetchFunction(): string {
        if (!this.currentToken.startsWith("fetch(")) {
            throw new SyntaxError('Expected "fetch" function');
        }
        const fetchArgument = this.currentToken.split("=")[1].replace(/\)/g, "");
        this.currentToken = this.advance();
        return `fetch(name="${fetchArgument}")`;
    }
}


