import { Token, TokenType } from './lexer';
import { DeviceModel, RackModel, SiteModel } from './models';
import { netboxDataProvider } from './netbox';
import { symbols } from './symbols';

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
//       site: $as
//       region: "east"
//       ru: "42"
//       role: "rdei-compute"
//       create: "true" 
//     }
//     br122: fetch(name='br121')
//   }

export class Parser {
    private tokenBuffer: Token[];
    private currentToken: Token | null;
    private tokenIndex: number;

    constructor(tokens: Token[]) {
        this.tokenBuffer = tokens;
        this.currentToken = null;
        this.tokenIndex = -1;
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

    private parseIdentifier(): string {
        if (this.currentToken && this.currentToken.type === TokenType.identifier) {
            const value = this.currentToken.value;
            this.advance();
            return value;
        } else {
            throw new SyntaxError(`parser: Expected identifier got ${this.currentToken?.type} at line ${this.currentToken?.line} char ${this.currentToken?.char}`);
        }
    }

    private parseFilter(): string {
        if (this.currentToken && this.currentToken.type === TokenType.filter) {
            const value = this.currentToken.value;
            this.advance();
            return value;
        } else {
            throw new SyntaxError(`parser: Expected filter got ${this.currentToken?.type} at line ${this.currentToken?.line} char ${this.currentToken?.char}`);
        }
    }

    // parse an individual object definition of site, rack, etc and return it as a string map
    private parseObject(): Map<string, string> {
        let obj = new Map<string,string>();
        if (this.currentToken && this.currentToken.type === TokenType.identifier) {
            obj.set("_symbol", this.currentToken.value);
        }
        this.advance();
        this.expect(TokenType.leftBrace);
        while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
            const key = this.parseIdentifier();
            // if fetch, then expect a filter
            if (key === "fetch") {
                // todo: implement fetch, right now just storing the fetch filter as a string
                const filter = this.parseFilter();
                obj.set(key, filter);
                continue;
            }
            // if not fetch, then expect a colon and then a string or reference
            this.expect(TokenType.colon);
            if (this.currentToken && (this.currentToken.type === TokenType.string || this.currentToken.type === TokenType.reference || this.currentToken.type === TokenType.filter)) {
                obj.set(key, this.currentToken.value);
                this.advance();
            }  else {
                throw new SyntaxError(`parser: Expected string, reference, or filter at line ${this.currentToken.line} char ${this.currentToken.char}`);
            }
        }
        this.expect(TokenType.rightBrace);
        return obj;
    }

    // parse a list of objects inside a top level identifier such as sites, racks, etc.
    // return a array of maps where each map is a single object
    private parseObjects(): Map<string, string>[] {
        let objArray: Array<Map<string,string>> = [];
        // loop through all of the objects inside top level identifier block such as sites
        while (this.currentToken && this.currentToken.type !== TokenType.rightBrace) {
            console.log(`parsing object definition: ${this.currentToken.value}`);
            let obj = this.parseObject();
            objArray.push(obj);
        }
        this.expect(TokenType.rightBrace);
        return objArray;
    }

    public parse(): void {
        const validTopLevelIdentifiers = ["sites", "racks", "devices"];

        this.advance();
        while (this.currentToken) {
            if (this.currentToken.type === TokenType.identifier) {
                const identifier = this.currentToken.value;
                this.advance();
                this.expect(TokenType.leftBrace);
                if (validTopLevelIdentifiers.includes(identifier)) {
                    let netboxObjects = this.parseObjects();
                    for (const obj of netboxObjects) {
                        console.log(obj);
                        let symbol = obj.get("_symbol");
                        if (symbol === undefined) {
                            throw new SyntaxError(`parser: Missing symbol for object`);
                        }
                        let parentNode:string|undefined;
                        switch (identifier) {
                            case "sites":
                                const site = new SiteModel(obj);
                                symbols.addSite(symbol, site);
                                // insert the site node into the tree
                                netboxDataProvider.insertNode(site.properties.get("name"), "site", site.treeId, "0");
                                break;
                            case "racks":
                                const rack = new RackModel(obj);
                                symbols.addRack(symbol, rack);
                                // find the parent node for this rack
                                if (rack.properties.get("name") === undefined) {
                                    break;
                                }
                                let rackSite = rack.properties.get("site");
                                if (rackSite === undefined) {
                                    parentNode = undefined;
                                } else {
                                    // if the site is a reference, then find the site model in the symbol table and get the treeId
                                    if (rackSite.startsWith("$")) {
                                        let rackSiteModel = symbols.getSite(rackSite.substring(1));
                                        if (rackSiteModel === undefined) { 
                                            parentNode = undefined;
                                        } else {
                                            parentNode = rackSiteModel.treeId;
                                        }
                                    }
                                }
                                // insert the rack node into the tree
                                netboxDataProvider.insertNode(rack.properties.get("name"), "rack", rack.treeId, parentNode);
                                break;
                            case "devices":
                                const device = new DeviceModel(obj);
                                symbols.addRack(symbol, device);
                                // find the parent node for this device
                                if (device.properties.get("name") === undefined) {
                                    break;
                                }
                                let deviceRack = device.properties.get("rack");
                                if (deviceRack === undefined) {
                                    parentNode = undefined;
                                } else {
                                    // if the rack is a reference, then find the rack model in the symbol table and get the treeId
                                    if (deviceRack.startsWith("$")) {
                                        let deviceRackModel = symbols.getRack(deviceRack.substring(1));
                                        if (deviceRackModel === undefined) { 
                                            parentNode = undefined;
                                        } else {
                                            parentNode = deviceRackModel.treeId;
                                        }
                                    }
                                }
                                // insert the device node into the tree
                                netboxDataProvider.insertNode(device.properties.get("name"), "device", device.treeId, parentNode);
                                break;
                        }
                    }
                } else {
                    throw new SyntaxError(`parser: Unknown identifier ${identifier} at line ${this.currentToken.line} position ${this.currentToken.char}`);
                }
            } else {
                throw new SyntaxError(`parser: Expected identifier got ${this.currentToken.type} at ${this.currentToken.line}:${this.currentToken.char}"`);
            }
        }
    }
}


