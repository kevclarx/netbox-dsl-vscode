import * as vscode from 'vscode';

import { NetboxTreeDataProvider } from './netboxTree';
import { NetboxObjectViewProvider } from './netboxObjectView';
import { Parser } from './parser';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('extension netbox-dsl is now active');
	const parser = new Parser();

	// WebView
	const netboxObjectViewProvider = new NetboxObjectViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(NetboxObjectViewProvider.viewType, netboxObjectViewProvider)
	);

	// TreeView
	new NetboxTreeDataProvider(context);

	const editor = vscode.window.activeTextEditor;
	if (editor) {
		parser.parseAndDisplay(editor.document);
	}

	// Register a Text Document Content Provider for the "netboxdsl" scheme
	// const provider = new class implements vscode.TextDocumentContentProvider {
	// 	onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	// 	onDidChange = this.onDidChangeEmitter.event;

	// 	provideTextDocumentContent(uri: vscode.Uri): string {
	// 		// Retrieve the active document and parse it
	// 		const document = vscode.window.activeTextEditor?.document;
	// 		if (document) {
	// 			parser.parseAndDisplay(document);
	// 		}

	// 		// Return an empty string as the content (not used)
	// 		return '';
	// 	}
	// };

	// context.subscriptions.push(
	// 	vscode.workspace.registerTextDocumentContentProvider('netboxdsl', provider)
	// );

	// // Register a command to open a virtual document with the "netboxdsl" scheme
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('extension.parseDocument', () => {
	// 		const uri = vscode.Uri.parse('netboxdsl://virtual_document');
	// 		vscode.workspace.openTextDocument(uri).then((document) => {
	// 			vscode.window.showTextDocument(document);
	// 		});
	// 	})
	// );

	// // Register an event listener for document changes
	// vscode.workspace.onDidChangeTextDocument((event) => {
	// 	// Only trigger the parsing if the active editor's document changed
	// 	if (event.document === vscode.window.activeTextEditor?.document) {
	// 		provider.onDidChangeEmitter.fire(vscode.Uri.parse('netboxdsl://virtual_document'));
	// 	}
	// });

}

// This method is called when your extension is deactivated
export function deactivate() { }
