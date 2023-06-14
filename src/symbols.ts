import { RackModel, SiteModel } from "./models";


class SymbolTable {
    private sitesMap: Map<string, SiteModel>;
    private racksMap: Map<string, RackModel>;

    constructor() {
        this.sitesMap = new Map<string,SiteModel>();
        this.racksMap = new Map<string,RackModel>();
    }

    public addSite(symbol: string, site: SiteModel): void {
        this.sitesMap.set(symbol, site);
    }

    public getSite(symbol: string): SiteModel | undefined {
        return this.sitesMap.get(symbol);
    }

    public addRack(symbol: string, rack: RackModel): void {
        this.racksMap.set(symbol, rack);
    }

    public getRack(symbol: string): RackModel | undefined {
        return this.racksMap.get(symbol);
    }
}

export var symbols: SymbolTable = new SymbolTable();