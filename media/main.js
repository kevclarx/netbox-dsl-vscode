// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
    const vscode = acquireVsCodeApi();

    // const myName = /** @type {HTMLElement} */ (document.getElementById('fname'));

    // const mytable = /** @type {HTMLElement} */ (document.getElementById('treeview'));



    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        const props = JSON.parse(message.props);
        const devices = message.devices;
        console.log("props: ",props);
        console.log("data: ",message.data)

        var labweekHeader = document.getElementById('lwheader');
        labweekHeader.textContent = `${props['name']}`

        // Create table.
        var table = document.createElement("table");

        for(const key in props){
          if (key.startsWith('_')){
            continue
          }
          var treeRow = table.insertRow();
          var treeCell = treeRow.insertCell();
          treeCell.innerHTML = key;
          var treeCell2 = treeRow.insertCell();
          treeCell2.innerHTML = props[key];
        };
        document.getElementById("treeone").appendChild(table);

        switch (message.data['type']) {
            case 'site':

                break;

            case 'rack':
              
                
                // second table to populate
                var treeTable = document.createElement("table");
                const numOfRacksUnits = Number(props["ru"]);
  

                for (let i = numOfRacksUnits; i >= 1; i--) {
                    var treeRow = treeTable.insertRow();
                    var treeCell = treeRow.insertCell();
                    treeCell.innerHTML = i;
                    console.log("rack unit i", i);
                    for (let j = 0; j < devices.length; j++ )
                    {
                      console.log("Devices j:", devices[j])
                      if (devices[j].position == i){
                        var treeCell2 = treeRow.insertCell();
                        treeCell2.innerHTML = devices[j].name;

                      }
                    }
                }
                document.getElementById("rackview").appendChild(treeTable);

                break;
            
            case 'device':

              break;

        }


    });
}());