import { Token, TokenType } from './lexer';
import { NetboxModel, RackModel, SiteModel } from './models';

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

    private parseObject(): { [key: string]: SiteModel | RackModel } {
        const obj: { [key: string]: any } = {};

        this.advance();
        this.expect(TokenType.leftBrace);
        while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
            const key = this.parseidentifier();
            this.expect(TokenType.colon);
            if (this.currentToken && (this.currentToken.type === TokenType.string || this.currentToken.type === TokenType.reference || this.currentToken.type === TokenType.filter)) {
                obj[key] = this.currentToken.value;
            }  else {
                throw new SyntaxError(`parser: Expected string, reference, or filter at line ${this.currentToken.line} char ${this.currentToken.char}`);
            }
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
                    let sites = this.parseObject();
                    console.log(sites);
                } else if (identifier === "racks") {
                    let racks = this.parseObject();
                    console.log(racks);
                } else {
                    throw new SyntaxError(`parser: Unknown identifier ${identifier} at line ${this.currentToken.line} position ${this.currentToken.char}`);
                }
            } else {
                throw new SyntaxError(`parser: Expected identifier got ${this.currentToken.type} at ${this.currentToken.line}:${this.currentToken.char}"`);
            }
        }
    }
}


