import * as vscode from 'vscode';

export class Lexer {
    private input: string; // current document
    private position: number; // current position in the input string
    private currentChar: string | null; // current character value at position
    private lineNumber: number; // current line number
    private charPosition: number; // position of the current character in the current line

    constructor() {
        this.input = "";
        this.position = 0;
        this.currentChar = "";
        this.lineNumber = 1;
        this.charPosition = 1;
    }

    private advance(): void {
        this.position++;
        this.charPosition++;
        if (this.position < this.input.length) {
            this.currentChar = this.input.charAt(this.position);
        } else {
            this.currentChar = null;
        }
    }

    private skipWhitespace(): void {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            if (this.currentChar === "\n") {
                this.lineNumber++;
                this.charPosition = 0;
            }
            this.advance();
        }
    }

    private getNextToken(): Token | null {
        while (this.currentChar !== null) {
            if (this.currentChar === "{") {
                const token: Token = {
                    type: TokenType.LeftBrace,
                    value: "{",
                    line: this.lineNumber,
                    char: this.charPosition,
                };
                this.advance();
                return token;
            }
            if (this.currentChar === "}") {
                const token: Token = {
                    type: TokenType.RightBrace,
                    value: "}",
                    line: this.lineNumber,
                    char: this.charPosition,
                };
                this.advance();
                return token;
            }
            if (this.currentChar === ":") {
                const token: Token = {
                    type: TokenType.Colon,
                    value: ":",
                    line: this.lineNumber,
                    char: this.charPosition,
                };
                this.advance();
                return token;
            }
            if (this.currentChar === "(") {
                const startLine = this.lineNumber;
                const startChar = this.charPosition;
                let filter = "";
                let parenthesesCount = 1;
                this.advance();

                while (this.currentChar !== null && parenthesesCount > 0) {
                    if (this.currentChar === "(") {
                        parenthesesCount++;
                    } else if (this.currentChar === ")") {
                        parenthesesCount--;
                    }
                    if (parenthesesCount > 0) {
                        filter += this.currentChar;
                    }
                    this.advance();
                }

                if (parenthesesCount !== 0) {
                    throw new SyntaxError("Unbalanced parentheses in filter");
                }

                const token: Token = {
                    type: TokenType.Filter,
                    value: filter,
                    line: startLine,
                    char: startChar,
                };
                return token;
            }
            if (/\w/.test(this.currentChar)) {
                let identifier = "";
                const startLine = this.lineNumber;
                const startChar = this.charPosition;
                while (
                    this.currentChar !== null &&
                    (/\w/.test(this.currentChar) || this.currentChar === "-" || this.currentChar === "=")
                ) {

                    identifier += this.currentChar;
                    this.advance();
                }
                const token: Token = {
                    type: TokenType.Identifier,
                    value: identifier,
                    line: startLine,
                    char: startChar,
                };
                return token;
            }
            if (this.currentChar === '"') {
                let stringLiteral = "";
                const startLine = this.lineNumber;
                const startChar = this.charPosition;
                this.advance();
                while (this.currentChar !== null && this.currentChar !== '"') {
                    stringLiteral += this.currentChar;
                    this.advance();
                }
                if (this.currentChar === '"') {
                    // stringLiteral += '"';
                    this.advance();
                    const token: Token = {
                        type: TokenType.String,
                        value: stringLiteral,
                        line: startLine,
                        char: startChar,
                    };
                    return token;
                } else {
                    throw new SyntaxError("Unterminated string literal");
                }
            }
            throw new SyntaxError(`Unexpected character: ${this.currentChar}`);
        }
        return null;
    }

    tokenize(input: string): Token[] {
        this.input = input;
        this.currentChar = this.input.charAt(0);
        const tokens: Token[] = [];
        let token = this.getNextToken();
        while (token !== null) {
            tokens.push(token);
            this.skipWhitespace();
            token = this.getNextToken();
        }
        console.log(`finished lexing, found ${tokens.length} tokens`);
        return tokens;
    }
}

export enum TokenType {
    LeftBrace = "LeftBrace",
    RightBrace = "RightBrace",
    Colon = "Colon",
    Identifier = "Identifier", // a "keyword" the dsl understands
    String = "String",
    Filter = "Filter", // for now lets assume anything in () is a filter, this may change
}

export class Token {
    type: TokenType;
    value: string;
    line: number;
    char: number;

    constructor(type: TokenType, value: string, line: number, char: number) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.char = char;
    }
}
