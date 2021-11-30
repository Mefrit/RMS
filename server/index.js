"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
const Application_1 = require("./Application");
const functions_1 = require("./modules/lib/functions");
const path2db = "./database.db3";
const application = new Application_1.Application(path2db);
http.createServer(function (request, response) {
    var uri = url.parse(request.url), post_data = "";
    if (uri.pathname == "/") {
        response.writeHead(200, { "Content-Type": "application/json" });
        request.on("data", (data) => {
            post_data += data;
        });
        request.on("end", () => {
            post_data = JSON.parse(post_data);
            const module_info = (0, functions_1.getUrlInfo)(uri.query);
            application.loadModule(module_info, post_data).then((data) => {
                response.write(JSON.stringify(data));
                response.end();
            });
        });
    }
    else {
        (0, functions_1.load_static_file)(response, uri);
    }
}).listen(8000);
console.log("run server on 8000 port111");

//# sourceMappingURL=maps/index.js.map
