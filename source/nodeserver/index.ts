
const http = require('http')
const fs = require('fs') // Для взаимодействия с файловой системой
const path = require('path') // Для работы с путями файлов и каталогов
const url = require('url')

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.map': "application/json"
}
function load_static_file(request, response, uri) {
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    // получаем путь после слеша
    const filePath = request.url.substr(1)
    fs.readFile(filePath, function (error, data) {
        const parsedUrl = new URL(filePath, 'https://node-http.glitch.me/');
        let pathName = parsedUrl.pathname;
        let ext = path.extname(pathName);
        if (error) {

            response.statusCode = 404
            response.end('Resourse not found!')

        } else {
            response.setHeader('Content-Type', mimeTypes[ext])
            response.end(data)
        }
    })
}
http.createServer(function (request, response) {
    var uri = url.parse(request.url);
    if (uri.pathname == "/") {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        // response.setHeader(200, { "Content-Type": "text/plain" });
        // response.end(JSON.stringify({ result: "ok" }));
        // response.write(JSON.stringify({ result: "ok111111111" }));
        // response.end();
        // response.close
        response.json(JSON.stringify({ result: "ok111111111" }));
    } else {
        load_static_file(request, response, uri);

    }



}).listen(3000);

//# sourceMappingURL=maps/index.js.map