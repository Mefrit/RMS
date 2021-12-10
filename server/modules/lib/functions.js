"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.isStatic = exports.getUrlInfo = exports.load_static_file = void 0;
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
const nodemailer = require("nodemailer");
function load_static_file(response, uri) {
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    const filePath = ".." + uri.pathname;
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
function isStatic(url) {
    let result = true;
    const parsedUrl = new URL(url, "https://node-http.glitch.me/");
    console.log("parsedUrl ==>>> ", parsedUrl);
    result = result && url.indexOf("node_modules/bootstrap") == -1;
    return true;
}
exports.isStatic = isStatic;
function sendEmail(transport_obj, mail_data) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(transport_obj);
        transporter.sendMail(mail_data, function (err, info) {
            if (err)
                resolve({ result: false, message: err.message });
            else {
                resolve({ result: true, info: info });
            }
        });
    });
}
exports.sendEmail = sendEmail;

//# sourceMappingURL=../../maps/modules/lib/functions.js.map
