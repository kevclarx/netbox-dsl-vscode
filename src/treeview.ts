import path = require('path');
import * as vscode from 'vscode';
import { NetboxObjectViewProvider } from './webview';
import { netboxDataProvider } from './netbox';
import { NetboxModel } from './models';


export class TreeNode extends vscode.TreeItem {
    children: TreeNode[];
    id: string;
    symbol: string;
    description: string;
  
    constructor(label: string, description: string, id: string, symbol: string, collapsibleState: vscode.TreeItemCollapsibleState, children: TreeNode[] = []) {
      super(label, collapsibleState);
      this.id = id;
      this.description = description;
      this.children = children;
      this.symbol = symbol;
    }
  }

export class TreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined | void> = new vscode.EventEmitter<TreeNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeNode): vscode.TreeItem {
        // const treeItem = new TreeNode(element.label, vscode.TreeItemCollapsibleState.Expanded, element.children);
        // treeItem.id = element.id;
        // treeItem.collapsibleState = element.children.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return element;
      }

      getChildren(element?: TreeNode): vscode.ProviderResult<TreeNode[]> {
        if (!element) {
          return netboxDataProvider.getTreeData();
        }
        return element.children;
      }

    showWebViewPanel(selection: TreeNode) {
        var obj: NetboxModel;
        switch (selection.description) {
            case "site":
                obj = netboxDataProvider.getSite(selection.symbol);
                break;
            case "rack":
                obj = netboxDataProvider.getRack(selection.symbol);
                break;
            case "device":
                obj = netboxDataProvider.getDevice(selection.symbol);
                break;
            default:
                return;
        }
        const panel = vscode.window.createWebviewPanel(
          NetboxObjectViewProvider.viewType,
          `Netbox Object Details: ${selection.label}`,
          vscode.ViewColumn.One,
          {}
      );
      panel.webview.postMessage({ data: obj });
    }

    constructor(context: vscode.ExtensionContext) {
        const options = {
            treeDataProvider: this,
            showCollapseAll: true
        };

        vscode.window.registerTreeDataProvider('netboxTree', this);
        const treeView = vscode.window.createTreeView('netboxTree', options);
        context.subscriptions.push(treeView);

        // setup: events
        treeView.onDidChangeSelection(e => {
            console.log(e);
            this.showWebViewPanel(e.selection[0]);
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
