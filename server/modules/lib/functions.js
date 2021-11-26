"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlInfo = exports.load_static_file = void 0;
const fs = require("fs");
const path = require("path");
const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".map": "application/json",
};
function load_static_file(response, uri) {
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    const filePath = uri.pathname.slice(1);
    fs.readFile(filePath, function (error, data) {
        const parsedUrl = new URL(filePath, "https://node-http.glitch.me/");
        let pathName = parsedUrl.pathname;
        let ext = path.extname(pathName);
        if (error) {
            response.statusCode = 404;
            response.end("Resourse not found!");
        }
        else {
            response.setHeader("Content-Type", mimeTypes[ext]);
            response.end(data);
        }
    });
}
exports.load_static_file = load_static_file;
function getUrlInfo(url) {
    var result = {};
    url.split("&").forEach(function (part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}
exports.getUrlInfo = getUrlInfo;

//# sourceMappingURL=../../maps/modules/lib/functions.js.map
