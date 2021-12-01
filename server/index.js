"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const port = 8000;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Application_1 = require("./Application");
const functions_1 = require("./modules/lib/functions");
const url = require("url");
const path2db = "./database.db3";
const application = new Application_1.Application(path2db);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "../")));
app.get('/', (request, response) => {
    console.log("HEREEE", request.body);
    response.writeHead(200, { "Content-Type": "application/json" });
    var uri = url.parse(request.url), post_data = "";
    request.on("data", (data) => {
        post_data += data;
    });
    request.on("end", () => {
        post_data = JSON.parse(post_data);
        const module_info = (0, functions_1.getUrlInfo)(uri.query);
        application.loadModule(module_info, post_data).then((data) => {
            response.send(JSON.stringify(data));
            response.end();
        });
    });
});
app.get('/p', function (req, res) {
    res.send("tagId is set to " + req.query);
});
const server = app.listen(port, (error) => {
    if (error)
        return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});

//# sourceMappingURL=maps/index.js.map
