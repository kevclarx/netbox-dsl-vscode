import { RackModel, SiteModel, DeviceModel } from "./models";


class SymbolTable {
    public sitesMap: Map<string, SiteModel>;
    public racksMap: Map<string, RackModel>;
    public devicesMap: Map<string, DeviceModel>;

    constructor() {
        this.sitesMap = new Map<string,SiteModel>();
        this.racksMap = new Map<string,RackModel>();
        this.devicesMap = new Map<string,DeviceModel>();
    }

    clear(): void {
        this.sitesMap = new Map<string,SiteModel>();
        this.racksMap = new Map<string,RackModel>();
        this.devicesMap = new Map<string,DeviceModel>();
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

    public addDevice(symbol: string, device: DeviceModel): void {
        this.devicesMap.set(symbol, device);
    }

    public getDevice(symbol: string): DeviceModel | undefined {
        return this.devicesMap.get(symbol);
    }

}

export var symbols: SymbolTable = new SymbolTable();