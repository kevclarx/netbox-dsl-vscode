import * as vscode from 'vscode';

import { NetboxTreeDataProvider } from './netboxTree';
import { NetboxObjectViewProvider } from './netboxObjectView';
import { Parser } from './parser';
import { Lexer, Token } from './lexer';


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

	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const lexer = new Lexer();
		let tokens: Token[] | undefined;
		try {
			let tokens = lexer.tokenize(editor.document.getText());
			console.log(tokens);
			const parser = new Parser(tokens);
			parser.parse();
		} catch (e) {
			let message = 'Unknown Error';
			if (e instanceof Error) { message = e.message; }
			console.log(message);
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
