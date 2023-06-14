

// This is the final output from parsing the DSL and
// contains all the objects needed to visualize and populate the backend
// Also sometimes called the "semantic model"
export class NetboxModel {

    constructor() {
       
    }

}

interface NetboxObject {
    requiredFields: string[];
    properties: Record<string, any>;
}

export class SiteModel implements NetboxObject {
    private type: string;
    public requiredFields: string[];
    public properties: Record<string, string>;

    constructor(props: Record<string, string>) {
        this.type = "site";
        this.requiredFields = ["name", "slug"];
        this.properties = props;
    }
}

export class RackModel implements NetboxObject {
    private type: string;
    public requiredFields: string[];
    public properties: Record<string, string>;

    constructor(props: Record<string, string>) {
        this.type = "rack";
        this.requiredFields = ["site", "name", "status", "width", "u_height"];
        this.properties = props;
    }
}
