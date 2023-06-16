import path = require('path');
import * as vscode from 'vscode';

    export function getWebviewContent(styleMainUri: vscode.Uri, scriptUri: vscode.Uri) {
		return `<!DOCTYPE html>
		<html>
		<head>
		  <style>
			.container {
			  display: flex;
			  height: 100vh;
			  overflow: auto;
			}
			.table {
			  border-collapse: collapse;
			  border: 1px solid black;
			  width: 50%;
			}
			.table2 {
			  border-collapse: collapse;
			  border: 1px solid black;
			  width: 33%;
			  counter-reset: rowNumber;
			}
			.table2 tr td:first-child::before {
			  min-width: 1em;
			  margin-right: 0.5em;
			}
			.space {
			  width: 20%;
			}
		  </style>
		</head>
		<body>
		<h2 class="align-items-center" id="lwheader"></h2>
		  <div class="container">
			<table class="table" id="treeone">

			</table>
			<div class="space"></div>
			<table class="table2" id="rackview">
			
			</table>
		  </div>
		  <script src="${scriptUri}"></script>
		</body>
		</html>`;
	}