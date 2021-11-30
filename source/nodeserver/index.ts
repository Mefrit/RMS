const http = require("http");

const url = require("url");

import { Application } from "./Application";
import { load_static_file, getUrlInfo } from "./modules/lib/functions";

const path2db = "./database.db3";
const application = new Application(path2db);

http.createServer(function (request, response) {
    var uri = url.parse(request.url),
        post_data = "";

    if (uri.pathname == "/") {
        // FIX ME как то покруче сделать
        response.writeHead(200, { "Content-Type": "application/json" });

        request.on("data", (data) => {
            post_data += data;
        });

        request.on("end", () => {
            post_data = JSON.parse(post_data);
            const module_info = getUrlInfo(uri.query);

            // console.log("module_info \n\n", module_info);
            application.loadModule(module_info, post_data).then((data) => {
                response.write(JSON.stringify(data));
                response.end();
            });
        });
    } else {
        load_static_file(response, uri);
    }
}).listen(8000);
console.log("run server on 8000 port111");
//# sourceMappingURL=maps/index.js.map
