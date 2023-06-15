

// This is the final output from parsing the DSL and converting it into a tree of NetboxModel objects
export interface NetboxModel {
    type: string;
    treeId: string;
    symbol?: string;
    requiredProperties: string[];
    validProperties?: string[]; // todo: add all valid property names from netbox api into this list for pre-validation
    properties: Map<string, string>;
}

export class SiteModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public symbol: string;
    public requiredProperties: string[];
    public properties: Map<string, string>;

    constructor(props: Map<string, string>, symbol: string) {
        this.type = "site";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["name", "slug"];
        this.properties = props;
        this.symbol = symbol;
    }
}

export class RackModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Map<string, string>;
    public symbol: string;

    constructor(props: Map<string, string>, symbol: string) {
        this.type = "rack";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["site", "name", "status", "width", "u_height"];
        this.properties = props;
        this.symbol = symbol;
    }
}

export class DeviceModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Map<string, string>;
    public symbol: string;
    public interfaces: InterfaceModel[];

    constructor(props: Map<string, string>, symbol: string) {
        this.type = "device";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["role", "devicetype", "site", "status"];
        this.properties = props;
        this.symbol = symbol;
        this.interfaces = [];
    }
}

export class DeviceRoleModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Map<string, string>;
    public symbol: string;

    constructor(props: Map<string, string>, symbol: string) {
        this.type = "devicerole";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["name", "slug", "color"];
        this.properties = props;
        this.symbol = symbol;
    }
}


export class InterfaceModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Map<string, string>;
    public cable: CableModel | undefined;

    constructor(props: Map<string, string>) {
        this.type = "interface";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["device", "name", "type"];
        this.properties = props;
        this.cable = undefined;
    }
}

class CableModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Map<string, string>;

    constructor(props: Map<string, string>) {
        this.type = "cable";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["termination_a_type", "termination_a_id", "termination_b_type", "termination_b_id"];
        this.properties = props;
    }
}

