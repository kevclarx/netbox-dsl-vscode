import path = require('path');
import * as vscode from 'vscode';

    export function getWebviewContent(styleMainUri: vscode.Uri, scriptUri: vscode.Uri) {
		return `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
					<link href="${styleMainUri}" rel="stylesheet">
				</head>
				<body>
					<!-- <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" /> -->
					
					
				<!--	<section>
					<nav>
					</nav>
					<article>
						
					</article>
					</section> -->

					<!--	<div class="container mt-5">
						<div class="row">

						  <div class="col">
						  <table>
						  <tr>
							  <th>Site</th>
							  <td>Detroit</td>
						  </tr>
						  <tr>
							  <th>Region</th>
							  <td>Central</td>
						  </tr>
						  <tr>
							  <th>RU</th>  
							  <td>24</td>
						  </tr>
						  <tr>
							  <th>Height</th>  
							  <td>48</td>
						  </tr>
						</table>

						  </div>
						  <div class="col">
						  <table id="treeview"></table>
						  </div>
						</div>
					  </div> -->


					<div>
						<div class="row " style="height: 100vh;"> <!-- align-items-center -->
							<div class="col-8"> <!-- class="mx-auto col-10 col-md-8 col-lg-6" -->
								<table class="table">
								<tr>
									<th>Site</th>
									<td>Detroit</td>
								</tr>
								<tr>
									<th>Region</th>
									<td>Central</td>
								</tr>
								<tr>
									<th>RU</th>  
									<td>24</td>
								</tr>
								<tr>
									<th>Height</th>  
									<td>48</td>
								</tr>
								</table>
							</div>
							<div class="col-4">
							<table class="table table-bordered table-dark" id="treeview"></table>
							</div>
						</div>
					</div>
					

						
	<!-- Bootstrap Bundle with Popper -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
					<script src="${scriptUri}"></script>
				</body>
				</html>`;
	}
