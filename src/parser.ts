import * as vscode from 'vscode';
import { Lexer, Token, TokenType } from './lexer';
import { NetboxModel } from './netboxModel';

// Example dsl syntax
// sites {
//     as: {
//       name: "Ashburn NDC"
//       slug: "as"
//       region: ""
//     }
//   }

//   racks {
//     br11: { 
//       site: "as"
//       region: "east"
//       ru: 42
//       role: "rdei-compute"
//       create: true 
//     }
//     br122: fetch(name='br121')
//   }


// Abstract Syntax Tree(ParseTree) nodes
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
    private tokenBuffer: Token[];
    private currentToken: Token | null;
    private tokenIndex: number;
    private model: NetboxModel;

    constructor(tokens: Token[]) {
        this.tokenBuffer = tokens;
        this.currentToken = null;
        this.tokenIndex = -1;
        this.model = new NetboxModel();
    }

    private advance(): void {
        this.tokenIndex++;
        if (this.tokenIndex < this.tokenBuffer.length) {
            this.currentToken = this.tokenBuffer[this.tokenIndex] as Token;
        } else {
            this.currentToken = null;
        }
    }

    private expect(type: TokenType): void {
        if (this.currentToken && this.currentToken.type === type) {
            this.advance();
        } else {
            throw new SyntaxError(`parser: Expected token of type ${type.value} got ${this.currentToken?.type.value} at line ${this.currentToken?.line} char ${this.currentToken?.char}`);
        }
    }

    private parseidentifier(): string {
        if (this.currentToken && this.currentToken.type === TokenType.identifier) {
            const value = this.currentToken.value;
            this.advance();
            return value;
        } else {
            throw new SyntaxError(`parser: Expected identifier got ${this.currentToken?.type} at line ${this.currentToken?.line} char ${this.currentToken?.char}`);
        }
    }

    private parseString(): string {
        if (this.currentToken && this.currentToken.type === TokenType.string) {
            const value = this.currentToken.value;
            this.advance();
            return value;
        } else {
            throw new SyntaxError(`parser: Expected string got ${this.currentToken?.type} at line ${this.currentToken?.line} char ${this.currentToken?.char}`);
        }
    }

    private parseKeyValue(): { key: string; value: string } {
        const key = this.parseidentifier();
        this.expect(TokenType.colon);
        const value = this.parseString();
        return { key, value };
    }

    private parseObject(): { [key: string]: any } {
        const obj: { [key: string]: any } = {};

        while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
            const key = this.parseidentifier();
            this.expect(TokenType.colon);
            const value = this.parseString();
            obj[key] = value;
        }

        this.expect(TokenType.rightBrace);
        return obj;
    }

    public parse(): void {
        this.advance();
        while (this.currentToken) {
            if (this.currentToken.type === TokenType.identifier) {
                const identifier = this.currentToken.value;
                if (identifier === "sites") {
                    this.advance();
                    this.expect(TokenType.leftBrace);
                    while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
                        const siteIdentifier = this.parseidentifier();
                        this.expect(TokenType.leftBrace);
                        while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
                            const { key, value } = this.parseKeyValue();
                            // Handle site information
                            console.log(`Site: ${key} - ${value}`);
                        }
                        this.expect(TokenType.rightBrace);
                    }
                    this.expect(TokenType.rightBrace);
                } else if (identifier === "racks") {
                    this.advance();
                    this.expect(TokenType.leftBrace);
                    while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
                        if (this.currentToken.type === TokenType.identifier) {
                            const rackidentifier = this.parseidentifier();
                            if (this.currentToken && this.currentToken.type === TokenType.leftBrace) {
                                this.expect(TokenType.leftBrace);
                                const rackObj = this.parseObject();
                                // Handle rack information
                                console.log(`Rack: ${rackidentifier} -`, rackObj);
                            } else {
                                // Handle fetch
                                this.expect(TokenType.colon);
                                const fetchName = this.parseString();
                                // Handle fetch information
                                console.log(`Fetch: ${rackidentifier} - ${fetchName}`);
                            }
                        } else {
                            throw new SyntaxError(`parser: Expected rack identifier at line ${this.currentToken.line} char ${this.currentToken.char}`);
                        }
                    }
                    this.expect(TokenType.rightBrace);
                } else {
                    throw new SyntaxError(`parser: Unknown identifier ${identifier} at line ${this.currentToken.line} position ${this.currentToken.char}`);
                }
            } else {
                throw new SyntaxError(`parser: Expected identifier got ${this.currentToken.type} at ${this.currentToken.line}:${this.currentToken.char}"`);
            }
        }
    }
}


