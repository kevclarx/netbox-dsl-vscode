import * as vscode from 'vscode';
import { TreeDataProvider, TreeNode } from "./treeview";
import { symbols } from './symbols';

export class NetboxDataProvider {
    private tree: TreeNode[];
    private treeDataProvider: TreeDataProvider|undefined;

    constructor() {
        this.tree = [];
        this.insertNode("Sites", "All Sites", "0", "", undefined);
    }

    setTreeProvider(treeDataProvider: TreeDataProvider): void {
        this.treeDataProvider = treeDataProvider;
    }

    clear(): void {
        this.tree = [];
        this.insertNode("Sites", "All Sites", "0", "", undefined);
        symbols.clear();
        this.refresh();
    }

    getTreeData(): TreeNode[] {
        return this.tree;
    }

    getSite(symbol: string): any {
        return symbols.getSite(symbol);
    }

    getRack(symbol: string): any {
        return symbols.getRack(symbol);
    }

    getDevice(symbol: string): any {
        return symbols.getDevice(symbol);
    }

    getDevicesByRackName(rackName: string): { name:string, position: number}[] {
        const devices: { name:string, position: number}[] = [];
        symbols.devicesMap.forEach((device, symbol) => {
            if (device.properties.get("rack") === rackName) {
                devices.push({ name: device.properties.get("name") || "", position: parseInt(device.properties.get("position") || "0") });
            }
        });
        return devices;
    }

    insertNode(label: string, description: string, id: string, symbol: string, parentId?: string): void {
        console.log(`insertNode: label: "${label}" description: "${description}" parent: "${parentId}"`);
        const newNode: TreeNode = {
            label: label,
            description: description,
            id: id,
            symbol: symbol,
            collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            children: [],
        };

        if (!parentId) {
            this.tree.push(newNode);
        } else {
            const parentNode = this.findNodeById(this.tree, parentId);
            if (parentNode) {
                parentNode.children.push(newNode);
            }
        }
        this.refresh();
    }
    
    private findNodeById(nodes: TreeNode[], id: string): TreeNode | undefined {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
            const foundNode = this.findNodeById(node.children, id);
            if (foundNode) {
                return foundNode;
            }
        }
        return undefined;
    }

    refresh(): void {
        if (this.treeDataProvider !== undefined) {
            this.treeDataProvider.refresh();
        }
    }

}

export var netboxDataProvider: NetboxDataProvider = new NetboxDataProvider();