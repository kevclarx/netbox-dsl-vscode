import * as vscode from 'vscode';

import { TreeDataProvider } from './treeview';
import { Parser } from './parser';
import { Lexer, Token } from './lexer';
import { symbols } from './symbols';
import { netboxDataProvider } from './netbox';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('extension netbox-dsl is now active');

	// TreeView
	const treeDataProvider: TreeDataProvider = new TreeDataProvider(context);
	netboxDataProvider.setTreeProvider(treeDataProvider);

	// Commands
	const command = 'netboxdsl.parse';
	const commandParseHandler = () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}
		netboxDataProvider.clear();
		const lexer = new Lexer();
		let tokens: Token[] | undefined;
		try {
			let tokens = lexer.tokenize(activeEditor.document.getText());
			console.log(tokens);
			const parser = new Parser(tokens);
			parser.parse();
		} catch (e) {
			let message = 'Unknown Error';
			if (e instanceof Error) { message = e.message; }
			console.log(message);
			vscode.window.showErrorMessage(message);
		}
		console.log(symbols);
	};
	context.subscriptions.push(vscode.commands.registerCommand(command, commandParseHandler));
}

// This method is called when your extension is deactivated
export function deactivate() { }
