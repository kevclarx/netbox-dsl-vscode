import path = require('path');
import * as vscode from 'vscode';

export function getWebviewContent(styleMainUri: vscode.Uri, scriptUri: vscode.Uri) {
	return `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${styleMainUri}" rel="stylesheet">
				</head>
				<body>
					<!-- <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" /> -->
					<table id="treeview"></table>

						

					<script src="${scriptUri}"></script>
				</body>
				</html>`;
}
