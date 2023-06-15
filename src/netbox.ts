import * as vscode from 'vscode';
import { TreeDataProvider, TreeNode } from "./treeview";
import { symbols } from './symbols';

export class NetboxDataProvider {
    private tree: TreeNode[];
    private treeDataProvider: TreeDataProvider|undefined;

    constructor() {
        this.tree = [];
        this.insertNode("Sites", "All Sites", "0", undefined);
    }

    setTreeProvider(treeDataProvider: TreeDataProvider): void {
        this.treeDataProvider = treeDataProvider;
    }

    clear(): void {
        this.tree = [];
        this.insertNode("Sites", "All Sites", "0", undefined);
        symbols.clear();
        this.refresh();
    }

    getTreeData(): TreeNode[] {
        return this.tree;
    }

    insertNode(label: string, description: string, id: string, parentId?: string): void {
        console.log(`insertNode: label: "${label}" description: "${description}" parent: "${parentId}"`);
        const newNode: TreeNode = {
            label: label,
            description: description,
            id: id,
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