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

    // advance the position pointer and set the currentChar
    private advance(): void {
        this.position++;
        this.charPosition++;
        if (this.position < this.input.length) {
            this.currentChar = this.input.charAt(this.position);
        } else {
            this.currentChar = null;
        }
    }

    // skip whitespace characters
    private skipWhitespace(): void {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            if (this.currentChar === "\n") {
                this.lineNumber++;
                this.charPosition = 0;
            }
            this.advance();
        }
    }

    // skip comments of format // until the end of the line
    private skipComments(): void {
        if (this.position + 1 >= this.input.length) {
            return;
        }
        if (this.currentChar === "/" && this.input.charAt(this.position + 1) === "/") {
            while (this.currentChar !== null && this.input.charAt(this.position) !== "\n") {
                this.advance();
            }
        }
        this.skipWhitespace();
    }

    // return the next token in the input string
    private getNextToken(): Token | null {
        while (this.currentChar !== null) {
            if (this.currentChar === "{") {
                const token: Token = {
                    type: TokenType.leftBrace,
                    value: "{",
                    line: this.lineNumber,
                    char: this.charPosition,
                };
                this.advance();
                return token;
            }
            if (this.currentChar === "}") {
                const token: Token = {
                    type: TokenType.rightBrace,
                    value: "}",
                    line: this.lineNumber,
                    char: this.charPosition,
                };
                this.advance();
                return token;
            }
            if (this.currentChar === ":") {
                const token: Token = {
                    type: TokenType.colon,
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
                    throw new SyntaxError(`lexer: Unbalanced parentheses in filter at line ${this.lineNumber} char ${this.charPosition}`);
                }

                const token: Token = {
                    type: TokenType.filter,
                    value: filter,
                    line: startLine,
                    char: startChar,
                };
                return token;
            }
            if (this.currentChar === "$") {
                let reference = "";
                const startLine = this.lineNumber;
                const startChar = this.charPosition;
                while (
                    this.currentChar !== null &&
                    (/\w/.test(this.currentChar) || this.currentChar === "$")
                ) {
                    reference += this.currentChar;
                    this.advance();
                }
                const token: Token = {
                    type: TokenType.reference,
                    value: reference,
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
                    type: TokenType.identifier,
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
                        type: TokenType.string,
                        value: stringLiteral,
                        line: startLine,
                        char: startChar,
                    };
                    return token;
                } else {
                    throw new SyntaxError(`lexer: Unterminated string literal at line ${this.lineNumber} char ${this.charPosition}`);
                }
            }
            throw new SyntaxError(`lexer: Unexpected character: ${this.currentChar} at line ${this.lineNumber} char ${this.charPosition}`);
        }
        return null;
    }

    // tokenize the input string
    tokenize(input: string): Token[] {
        this.input = input;
        this.currentChar = this.input.charAt(0);
        const tokens: Token[] = [];
        this.skipWhitespace();
        this.skipComments();
        let token = this.getNextToken();
        while (token !== null) {
            tokens.push(token);
            this.skipWhitespace();
            this.skipComments();
            token = this.getNextToken();
        }
        console.log(`finished lexing, found ${tokens.length} tokens`);
        return tokens;
    }
}

// using a static class instead of enum here because TS cannot seem to infer proper types in parser otherwise
export class TokenType {
    public static readonly leftBrace = new TokenType("{");
    public static readonly rightBrace = new TokenType("}");
    public static readonly colon = new TokenType(":");
    public static readonly identifier = new TokenType("Identifier");
    public static readonly reference = new TokenType("Reference");
    public static readonly string = new TokenType("String");
    public static readonly filter = new TokenType("Filter");

    private constructor(public readonly value: string) { }
}

// a token is a single "word" in the dsl
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
