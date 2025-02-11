/** 
 *  To edit this, please make sure you have just this folder open in VS Code, press Ctrl+Shift+B, and select "tsc: watch - tsconfig.json".
 *  this will compile the typescript file into javascript that just works automagically in the browser (dont forget to refresh though)
 * 
 * */

let message: string = 'Hello World';
console.log(message);

let base_server_url: string = "https://study-backend.ibaguette.com";
let localhost_server_url: string = "http://localhost:8787"; // local testing server / in case of cors

var button1 = document.getElementById('button1');
var main_text_component = document.getElementById('main_text_component');
var toggleButton = document.getElementById('toggleButton');
var searchButton = document.getElementById('searchButton');

if (button1) {
    button1.addEventListener('click', function() {
        if (main_text_component) {
            // GET data from "/tables" endpoint
            var time_start = performance.now();
            fetch(base_server_url + '/tables')
                .then(response => response.json())
                .then(data => {
                    var time_end = performance.now();
                    var time_diff = time_end - time_start;
                    data["time"] = time_diff;
                    console.log(data);
                    update_text(JSON.stringify(data));
                });
        }
    });
}


if (searchButton) {
    searchButton.addEventListener('click', function() {
        // toggle between localhost and base server
        if (base_server_url == "https://study-backend.ibaguette.com") {
            base_server_url = localhost_server_url;
        } else {
            base_server_url = "https://study-backend.ibaguette.com";
        }
        update_text("Server URL: " + base_server_url);
    });
}



if (toggleButton) {
    toggleButton.addEventListener('click', function() {
        // toggle between localhost and base server
        if (base_server_url == "https://study-backend.ibaguette.com") {
            base_server_url = localhost_server_url;
        } else {
            base_server_url = "https://study-backend.ibaguette.com";
        }
        update_text("Server URL: " + base_server_url);
    });
}

function update_text(text_to_set: string) {
    if (main_text_component) {
        main_text_component.innerHTML = text_to_set;
    }
}