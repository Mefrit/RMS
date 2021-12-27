"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require("express-session");
const Application_1 = require("./Application");
const bodyParser = require("body-parser");
const settings_1 = require("./settings");
const functions_1 = require("./modules/lib/functions");
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
router.post("/api_cms", upload.array("uploaded_files"), (request, response, next) => {
    if (request.method == "POST") {
        var body = "";
        const files = request.files;
        console.log(files);
        if (!files) {
            const error = new Error("Please choose files");
            error.httpStatusCode = 400;
            return next(error);
        }
        files.forEach((element) => {
            file_system_1.fs.writeFile(`./server/download/image.jpg`, element.buffer, () => console.log("finished downloading!"));
        });
        response.send(JSON.stringify({ result: false }));
        response.end();
    }
});
router.post("/api", (request, response) => {
    console.log("request.files", request);
    if (request.method == "POST") {
        var body = "";
        request.on("data", function (data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });
        request.on("end", function () {
            var post_data = JSON.parse(body);
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
