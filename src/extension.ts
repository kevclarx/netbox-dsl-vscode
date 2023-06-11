import * as vscode from 'vscode';

import { NetboxTreeDataProvider } from './netboxTree';
import { NetboxObjectViewProvider } from './netboxObjectView';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('extension netbox-dsl is now active');
	
	// WebView
	const netboxObjectViewProvider = new NetboxObjectViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(NetboxObjectViewProvider.viewType, netboxObjectViewProvider)
	);

	// TreeView
	new NetboxTreeDataProvider(context);
}

// This method is called when your extension is deactivated
export function deactivate() { }
