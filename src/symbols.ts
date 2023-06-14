import { RackModel, SiteModel } from "./models";


class SymbolTable {
    private table: Map<string, string>;

    constructor() {
        this.table = new Map();
    }

    public addSiteReference(name: string, slug: string): void {
        this.table.set(name, slug);
    }

    public getSiteSlug(name: string): string | undefined {
        return this.table.get(name);
    }

}

var siteSymbols: Record<string, SiteModel>;
var rackSymbols: Record<string, RackModel>;