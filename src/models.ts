

// This is the final output from parsing the DSL and converting it into a tree of NetboxModel objects
export interface NetboxModel {
    type: string;
    treeId: string;
    requiredProperties: string[];
    validProperties?: string[]; // todo: add all valid property names from netbox api into this list for pre-validation
    properties: Record<string, any>;
}

export class SiteModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Record<string, any>;

    constructor(props: Record<string, any>) {
        this.type = "site";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["name", "slug"];
        this.properties = props;
    }
}

export class RackModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Record<string, any>;

    constructor(props: Record<string, any>) {
        this.type = "rack";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["site", "name", "status", "width", "u_height"];
        this.properties = props;
    }
}

export class DeviceModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Record<string, any>;
    public interfaces: InterfaceModel[];

    constructor(props: Record<string, any>) {
        this.type = "device";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["role", "devicetype", "site", "status"];
        this.properties = props;
        this.interfaces = [];
    }
}

export class DeviceRoleModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Record<string, any>;

    constructor(props: Record<string, any>) {
        this.type = "devicerole";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["name", "slug", "color"];
        this.properties = props;
    }
}


export class InterfaceModel implements NetboxModel {
    public type: string;
    public treeId: string;
    public requiredProperties: string[];
    public properties: Record<string, any>;
    public cable: CableModel | undefined;

    constructor(props: Record<string, any>) {
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
    public properties: Record<string, any>;

    constructor(props: Record<string, any>) {
        this.type = "cable";
        this.treeId = Date.now().toString();
        this.requiredProperties = ["termination_a_type", "termination_a_id", "termination_b_type", "termination_b_id"];
        this.properties = props;
    }
}

