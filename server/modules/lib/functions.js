"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.sendEmail = exports.isStatic = exports.getUrlInfo = exports.load_static_file = void 0;
const fs = require("fs");
const path = require("path");
const md5 = require("md5");
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
function authenticate(login, password, application) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        application.getDbConnection().then((data) => __awaiter(this, void 0, void 0, function* () {
            if (data.result) {
                const sql = `SELECT id_user FROM users WHERE login='${login}' AND password='${md5(password.trim())}' `;
                data.db_cis.query(sql, (err, res) => {
                    if (err) {
                        resolve({ result: false, message: "Ошибка при загрузке пользователя" + err.message });
                    }
                    if (res == undefined) {
                        resolve({ result: false, message: "Ошибка при загрузке пользователя" });
                    }
                    else {
                        if (res.hasOwnProperty("rows")) {
                            if (res.rows.length > 0) {
                                resolve({ result: true, id_user: res.rows[0].id_user });
                            }
                        }
                    }
                    resolve({ result: true, id_user: 20 });
                    data.db_cis.end();
                });
            }
        }));
    }));
}
exports.authenticate = authenticate;

//# sourceMappingURL=../../maps/modules/lib/functions.js.map
