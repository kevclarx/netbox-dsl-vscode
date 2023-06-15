import path = require('path');
import * as vscode from 'vscode';

    export function getWebviewContent(styleMainUri: vscode.Uri) {
		return `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${styleMainUri}" rel="stylesheet">
				</head>
				<body>
					<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
					<h1 id="fname"></h1>
					<table>
						<tr>
							<th>Site</th>
							<th>Rack</th>
							<th>Device</th>
						</tr>
						<tr>
							<td>AS</td>
							<td>Rack 1</td>
							<td>Device 1</td>
						</tr>
						<tr>
							<td>DNLY</td>
							<td>Rack 2</td>
							<td>Device 2</td>
						</tr>
						<tr>
							<td>Chicago</td>
							<td>Rack 2</td>
							<td>Device 2</td>
						</tr>
						</table>
						<script>
                        const name = document.getElementById('fname');
                
                        // Handle the message inside the webview
                        window.addEventListener('message', event => {
                
                            const message = event.data; // The JSON data our extension sent
                            name.textContent = message.name;
                        });
                    </script>


				</body>
				</html>`;
	}

