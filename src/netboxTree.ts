import path = require('path');
import * as vscode from 'vscode';

export class NetboxTreeProvider implements vscode.TreeDataProvider<NetboxTreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<NetboxTreeItem | undefined | void> = new vscode.EventEmitter<NetboxTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<NetboxTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    data: NetboxTreeItem;

    constructor(private workspaceRoot: string | undefined) {
        this.workspaceRoot = workspaceRoot;
        this.data = new NetboxTreeItem("netbox.cie.comcast.net", "server", vscode.TreeItemCollapsibleState.Expanded);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NetboxTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: NetboxTreeItem): NetboxTreeItem[] | Thenable<NetboxTreeItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No netbox objects in empty workspace');
            return Promise.resolve([]);
        }
        if (element === undefined) {
            return Promise.resolve([this.data]); 
        }
        return Promise.resolve([new NetboxTreeItem("Comcast East", "region", vscode.TreeItemCollapsibleState.None)]);
       
    }
}

export class NetboxTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = this.description;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };

    contextValue = 'node';
}