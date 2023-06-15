// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
    const vscode = acquireVsCodeApi();

    // const myName = /** @type {HTMLElement} */ (document.getElementById('fname'));

    // const mytable = /** @type {HTMLElement} */ (document.getElementById('treeview'));



    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent

        console.log("These are my devices: ",message.data);

        var table = document.createElement("table");
        for (var VAL of message.devices) { 
            var row = table.insertRow();
            let cell = row.insertCell();
            cell.innerHTML = VAL; 
        }
        document.getElementById("treeview").appendChild(table);


    });
}());