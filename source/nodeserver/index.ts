
const express = require('express');
const port = 8000;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
import { Application } from "./Application";
import { load_static_file, getUrlInfo } from "./modules/lib/functions";


const url = require("url");
const path2db = "./database.db3";
const application = new Application(path2db);
// Use Node.js body parsing middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true,
// }));
// console.log(__dirname, request.url);
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, "../")));
app.get('/', (request, response) => {
    console.log("HEREEE", request.body, request.query);
    response.writeHead(200, { "Content-Type": "application/json" });
    var uri = url.parse(request.url),
        post_data = "";
    request.on("data", (data) => {
        post_data += data;
    });

    request.on("end", () => {
        post_data = JSON.parse(post_data);
        const module_info = getUrlInfo(uri.query);

        // console.log("module_info \n\n", module_info);
        application.loadModule(module_info, post_data).then((data) => {
            response.send(JSON.stringify(data));
            response.end();
        });
    });
    // response.send({
    //     message: 'Node.js and Express REST API'
    // }

});
app.get('/:id', function (req, res) {

    const query = req.query;// query = {sex:"female"}

    const params = req.params; //params = {id:"000000"}
    console.log(req.query, req.params);

})
app.get('/p', function (req, res) {
    res.send("tagId is set to " + req.query);
});
// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);

});
// const http = require("http");

// const url = require("url");

// import { Application } from "./Application";
// import { load_static_file, getUrlInfo } from "./modules/lib/functions";

// const path2db = "./database.db3";
// const application = new Application(path2db);

// http.createServer(function (request, response) {
//     var uri = url.parse(request.url),
//         post_data = "";

//     if (uri.pathname == "/") {
//         // FIX ME как то покруче сделать
//         response.writeHead(200, { "Content-Type": "application/json" });

//         request.on("data", (data) => {
//             post_data += data;
//         });

//         request.on("end", () => {
//             post_data = JSON.parse(post_data);
//             const module_info = getUrlInfo(uri.query);

//             // console.log("module_info \n\n", module_info);
//             application.loadModule(module_info, post_data).then((data) => {
//                 response.write(JSON.stringify(data));
//                 response.end();
//             });
//         });
//     } else {
//         load_static_file(response, uri);
//     }
// }).listen(8000);
// console.log("run server on 8000 port111");
//# sourceMappingURL=maps/index.js.map