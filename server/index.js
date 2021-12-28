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
const express = require("express");
const session = require("express-session");
const Application_1 = require("./Application");
const bodyParser = require("body-parser");
const settings_1 = require("./settings");
const functions_1 = require("./modules/lib/functions");
const md5 = require("md5");
const file_system_1 = require("file-system");
const multer = require("multer");
const path = require("path");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const application = new Application_1.Application(settings_1.path2db_sqlite, settings_1.dsn_cis);
const router = express.Router();
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "strange mood",
}));
router.use((req, res, next) => {
    delete req.session.error;
    delete req.session.success;
    next();
});
router.use(settings_1.addition_path + "/login", bodyParser.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded",
}));
router.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
router.post(settings_1.addition_path + "/login", (req, res) => {
    (0, functions_1.authenticate)(req.body.username, req.body.password, application).then((answ) => {
        console.log("Here");
        if (answ.result) {
            req.session.regenerate(() => {
                req.session.user = { id_user: answ.id_user };
                if (req.url.indexOf("public") == -1) {
                    console.log("Here");
                    res.redirect(req.query.back || req.baseUrl + settings_1.addition_path + "/public/index.html");
                }
                else {
                    res.redirect(req.query.back || req.baseUrl + req.url);
                }
            });
        }
        else {
            req.session.error = "Authentication failed, please check your " + " username and password.";
            res.redirect(req.baseUrl + "/login");
        }
    });
});
router.get(settings_1.addition_path + "/login", (req, res) => {
    res.render("login", {
        error: req.session.error,
        success: req.session.success,
    });
});
router.get(settings_1.addition_path + "/public/comments.html", (req, res, next) => {
    const url = new URL(req.url, "https://node-http.glitch.me/");
    if (url.searchParams.get("id_question") != null && url.searchParams.get("id_user") != null) {
        req.session.comments = { id_user: url.searchParams.get("id_user") };
    }
    next();
});
router.get(settings_1.addition_path + "/public/teach.html", (req, res, next) => {
    req.session.comments = undefined;
    next();
});
router.get(settings_1.addition_path + "/public/index.html", (req, res, next) => {
    req.session.comments = undefined;
    next();
});
router.get(settings_1.addition_path + "/api_cms", (req, res) => {
    console.log("HERE APICMS GET");
});
router.post("/api_files", upload.array("uploaded_files"), (request, response, next) => {
    if (request.method == "POST") {
        const files = request.files;
        const url_params_file = (0, functions_1.getUrlInfo)(request.url.split("?")[1]);
        if (!files) {
            const error = new Error("Please choose files");
            error.httpStatusCode = 400;
            return next(error);
        }
        let path_to_file = "";
        application.getDbConnection().then((data) => __awaiter(void 0, void 0, void 0, function* () {
            const sqlite = data.db_sqlite;
            const sql = "INSERT INTO files( name, num_question, path, time_receipt) VALUES(?, ?, ?, ?)";
            let have_dir, d1, d2;
            sqlite.serialize(() => {
                files.forEach((element, key, arr) => __awaiter(void 0, void 0, void 0, function* () {
                    path_to_file = md5(element.buffer) + path.extname(element.originalname);
                    d1 = path_to_file.slice(0, 2);
                    d2 = path_to_file.slice(2, 4);
                    have_dir = yield (0, functions_1.checkDir)(settings_1.path_to_download, d1, d2);
                    if (have_dir.result) {
                        file_system_1.fs.writeFile("." + settings_1.path_to_download + d1 + "/" + d2 + "/" + path_to_file, element.buffer, () => {
                            console.log("finished downloading!");
                            sqlite.run(sql, [element.originalname, url_params_file.num_request, path_to_file, url_params_file.time_receipt], (err, rows) => {
                                if (!err) {
                                    console.log("\nfinished insert SQL!\n");
                                }
                                else {
                                    console.log("\nfERORRO\n", err);
                                }
                            });
                        });
                    }
                    else {
                        response.send(JSON.stringify({ result: false, message: 'Не удалось создать папку' }));
                        response.end();
                    }
                }));
            });
            response.send(JSON.stringify({ result: true }));
            response.end();
        }));
    }
});
router.post("/api", (request, response) => {
    if (request.method == "POST") {
        var body = "";
        request.on("data", function (data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });
        request.on("end", function () {
            var post_data = JSON.parse(body);
            console.log("post_data ==> ", post_data);
            if (request.session.user) {
                post_data.id_user = request.session.user.id_user;
            }
            application.loadModule(post_data).then((data) => {
                response.send(JSON.stringify(data));
                response.end();
            });
        });
    }
});
router.post("/send", upload.array("file_uploaded"), (request, response) => {
    if (request.method == "POST") {
        let attachments = request.files.map((file) => {
            return { filename: file.originalname, content: file.buffer };
        });
        const send_data = {
            from: request.body.address2sender,
            to: request.body.address2send,
            subject: request.body.subject,
            text: request.body.content,
            attachments: attachments,
        };
        (0, functions_1.sendEmail)(settings_1.transport_obj, send_data).then((data) => {
            if (data.result) {
                const module_info = {
                    module: "Answer",
                    action: "SetTimeAnswering",
                    time: new Date().getTime(),
                    id_question: request.body.id_question,
                };
                application.loadModule(module_info).then((data) => {
                    if (!data.result) {
                        response.redirect(request.baseUrl + settings_1.addition_path + "/public/index.html?message=" + data.message);
                    }
                    else {
                        response.redirect(request.baseUrl + settings_1.addition_path + "/public/index.html");
                    }
                    response.end();
                });
            }
            else {
                response.redirect(request.baseUrl +
                    settings_1.addition_path +
                    `/public/answer.html?id_question=${request.body.id_question}&message=${data.message}`);
                response.end();
            }
        });
    }
});
function restrict(req, res, next) {
    if (req.session.user || req.session.comments || req.url.indexOf("bootstrap") != -1) {
        next();
    }
    else {
        if (req.url != settings_1.addition_path + "/login" && req.url != settings_1.addition_path + "/public/login.html") {
            var url = req.baseUrl + settings_1.addition_path + "/login";
            console.log("Here222", url);
            res.redirect(url);
        }
        else {
            res.render("login", {
                error: req.session.error,
                success: req.session.success,
            });
        }
    }
}
router.use(restrict);
app.set("view engine", "ejs");
app.set("views", __dirname + settings_1.addition_path + "/../public/views/");
app.locals.base_path = settings_1.base_path;
app.locals.addition_path = settings_1.addition_path;
app.use("/", router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../")));
const server = app.listen(settings_1.port, (error) => {
    if (error)
        return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});

//# sourceMappingURL=maps/index.js.map
