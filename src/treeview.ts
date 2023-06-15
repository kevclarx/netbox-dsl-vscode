import * as vscode from 'vscode';
import { netboxDataProvider } from './netbox';
import { NetboxModel } from './models';
import { getWebviewContent } from './webview';


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

  showWebViewPanel(selection: TreeNode, context: vscode.ExtensionContext) {
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

    // get netbox models
    var obj: NetboxModel;
    var props: string;
    switch (selection.description) {
      case "site":
        obj = netboxDataProvider.getSite(selection.symbol);
        props = this.propsStringify(obj.properties);
        panel.webview.postMessage({ data: obj, props: props });
        break;
      case "rack":
        obj = netboxDataProvider.getRack(selection.symbol);
        props = this.propsStringify(obj.properties);
        const rackName = obj.properties.get("name");
        let rackDevices: string[] = [];
        if (rackName !== undefined) {
          rackDevices = netboxDataProvider.getDevicesByRackName(rackName);
        }
        console.log("rack devices: ", rackDevices)
        panel.webview.postMessage({ data: obj, props: props, devices: rackDevices });
        break;
      case "device":
        obj = netboxDataProvider.getDevice(selection.symbol);
        props = this.propsStringify(obj.properties);
        panel.webview.postMessage({ data: obj, props: props });
        break;
      default:
        return;
    }
  }

  // convert Map<string, string> to JSON string so it can be serialized and passed to webview
  propsStringify(props: Map<string, string>): string {
    const propsJsonObject: { [key: string]: string } = {};
    props.forEach((value, key) => {
      propsJsonObject[key] = value;
    });
    const propsJsonString = JSON.stringify(propsJsonObject);
    console.log("props json: ", propsJsonString);
    return propsJsonString;
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
