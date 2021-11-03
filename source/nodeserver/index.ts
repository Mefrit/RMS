const http = require("http");

const url = require("url");
import { Application } from "./Application";
import { load_static_file, getUrlInfo } from "./modules/lib/functions";

const path2db = "./database.db3";
const application = new Application(path2db);

http.createServer(function (request, response) {
    var uri = url.parse(request.url),
        post_data = "";
    // console.log(uri);
    if (uri.pathname == "/") {
        response.writeHead(200, { "Content-Type": "application/json" });
        request.on("data", (data) => {
            post_data += data;
        });

        request.on("end", () => {
            console.log("post_data \n\n", JSON.parse(post_data));
            post_data = JSON.parse(post_data);
            const module_info = getUrlInfo(uri.query);

            console.log("module_info \n\n", module_info);
            application.loadModule(module_info, post_data).then((data) => {
                console.log("!loadModule ======>>>>>>>> ", data);
                response.write(JSON.stringify(data));
                response.end();
            });
        });

        // response.close
        // response.json(JSON.stringify({ result: "ok111111111" }));
    } else {
        load_static_file(request, response, uri);
    }
}).listen(3000);

//# sourceMappingURL=maps/index.js.map
