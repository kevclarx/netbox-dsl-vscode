import path = require('path');
import * as vscode from 'vscode';
import { getWebviewContent } from './webview';

export class NetboxTreeDataProvider implements vscode.TreeDataProvider<NetboxTreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<NetboxTreeItem | undefined | void> = new vscode.EventEmitter<NetboxTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<NetboxTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NetboxTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: NetboxTreeItem): NetboxTreeItem[] | Thenable<NetboxTreeItem[]> {
        if (element === undefined) {
            return Promise.resolve([new NetboxTreeItem("netbox.cie.comcast.net", "server", vscode.TreeItemCollapsibleState.Collapsed)]); 
        }
        return Promise.resolve([new NetboxTreeItem("Comcast East", "region", vscode.TreeItemCollapsibleState.None)]);
    }

    showWebViewPanel(selection: NetboxTreeItem, context: vscode.ExtensionContext) {
        const panel = vscode.window.createWebviewPanel(
            "netboxObjectView",
            `Netbox Object Details: ${selection.label}`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
          );

          const styleMainUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'main.css'));
          const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js'));
          panel.webview.html = getWebviewContent(styleMainUri, scriptUri);
          panel.webview.postMessage({devices: ["sfld-300-09-01-45", "sfld-300-09-01-46", "sfld-300-09-01-47"]});
    }

    constructor(context: vscode.ExtensionContext) {
        const options = {
            treeDataProvider: this,
            showCollapseAll: true
        };

        vscode.window.registerTreeDataProvider('netboxTree', this);
        const tree = vscode.window.createTreeView('netboxTree', options);
        context.subscriptions.push(tree);

        // setup: events
        tree.onDidChangeSelection(e => {
            console.log(e);
            this.showWebViewPanel(e.selection[0], context); 
        });
        // tree.onDidCollapseElement(e => {
        //     console.log(e);
        // });
        // tree.onDidChangeVisibility(e => {
        //     console.log(e);
        // });
        // tree.onDidExpandElement(e => {
        //     console.log(e);
        // });
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