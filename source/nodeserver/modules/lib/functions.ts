const fs = require("fs"); // Для взаимодействия с файловой системой
const path = require("path"); // Для работы с путями файлов и каталогов
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
import * as nodemailer from "nodemailer";
import { get_db_connection_answer } from "../../interfaces/interface";
export function load_static_file(response, uri) {
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    // получаем путь после слеша
    // const filePath = request.url.substr(1);
    const filePath = ".." + uri.pathname;

    fs.readFile(filePath, function (error, data) {
        const parsedUrl = new URL(filePath, "https://node-http.glitch.me/");
        let pathName = parsedUrl.pathname;
        let ext = path.extname(pathName);

        if (error) {
            response.statusCode = 404;
            response.end("Resourse not found!");
        } else {
            response.setHeader("Content-Type", mimeTypes[ext]);
            response.end(data);
        }
    });
}
export function getUrlInfo(url) {
    var result = {};
    url.split("&").forEach(function (part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}
export function isStatic(url) {
    let result = true;
    result = result && url.indexOf("node_modules/bootstrap") == -1;
    return true;
}
export function sendEmail(transport_obj, mail_data) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(transport_obj);

        transporter.sendMail(mail_data, function (err, info) {
            if (err) resolve({ result: false, message: err.message });
            else {
                resolve({ result: true, info: info });
            }
        });
        // resolve({ result: false, message: "не удалось отправить сообщение" })
    });
}
export function authenticate(login, password, application) {
    return new Promise(async (resolve, reject) => {
        application.getDbConnection().then(async (data: get_db_connection_answer) => {
            if (data.result) {
                const sql = `SELECT id_user FROM users WHERE login='${login}' AND password='${md5(password.trim())}' `;
                data.db_cis.query(sql, (err, res) => {
                    if (err) {
                        resolve({ result: false, message: "Ошибка при загрузке пользователя" + err.message });
                    }
                    if (res == undefined) {
                        resolve({ result: false, message: "Ошибка при загрузке пользователя" });
                    } else {
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
        });
    });
}
