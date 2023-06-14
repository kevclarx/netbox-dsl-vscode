

// This is the final output from parsing the DSL and
// contains all the objects needed to visualize and populate the backend
export interface NetboxModel {
    type: string;
    requiredProperties: string[];
    validProperties?: string[]; // todo: add all valid property names from netbox api into this list for pre-validation
    properties: Record<string, any>;
}

export class SiteModel implements NetboxModel {
    public type: string;
    public requiredProperties: string[];
    public properties: Record<string, any>;

    constructor(props: Record<string, any>) {
        this.type = "site";
        this.requiredProperties = ["name", "slug"];
        this.properties = props;
    }
}

export class RackModel implements NetboxModel {
    public type: string;
    public requiredProperties: string[];
    public properties: Record<string, string>;

    constructor(props: Record<string, any>) {
        this.type = "rack";
        this.requiredProperties = ["site", "name", "status", "width", "u_height"];
        this.properties = props;
    }
}
