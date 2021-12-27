import * as express from "express";
import * as session from "express-session";
import { Application } from "./Application";
import * as bodyParser from "body-parser";
import { transport_obj, dsn_cis, path2db_sqlite, base_path, port, addition_path } from "./settings";
//
import { multer } from "multer";
import { authenticate_answer, send_email_answer } from "./interfaces/interface";
import { sendEmail, authenticate } from "./modules/lib/functions";
import { resolve } from "path/posix";
//
import { fs } from "file-system";
const multer = require("multer");
const path = require("path");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const application = new Application(path2db_sqlite, dsn_cis);

const router = express.Router();

router.use(
    session({
        resave: false, // don't save session if unmodified
        saveUninitialized: true, // don't create session until something stored
        secret: "strange mood",
    })
);

router.use((req, res, next) => {
    delete req.session.error;
    delete req.session.success;
    next();
});

router.use(
    addition_path + "/login",
    bodyParser.urlencoded({
        extended: true,
        type: "application/x-www-form-urlencoded",
    })
);
router.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
router.post(addition_path + "/login", (req, res) => {
    authenticate(req.body.username, req.body.password, application).then((answ: authenticate_answer) => {
        console.log("Here");
        if (answ.result) {
            req.session.regenerate(() => {
                req.session.user = { id_user: answ.id_user };
                if (req.url.indexOf("public") == -1) {
                    console.log("Here");
                    res.redirect(req.query.back || req.baseUrl + addition_path + "/public/index.html");
                } else {
                    res.redirect(req.query.back || req.baseUrl + req.url);
                }
            });
        } else {
            req.session.error = "Authentication failed, please check your " + " username and password.";
            res.redirect(req.baseUrl + "/login");
        }
    });
});
router.get(addition_path + "/login", (req, res) => {
    res.render("login", {
        error: req.session.error,
        success: req.session.success,
    });
});
router.get(addition_path + "/public/comments.html", (req, res, next) => {
    const url = new URL(req.url, "https://node-http.glitch.me/");
    if (url.searchParams.get("id_question") != null && url.searchParams.get("id_user") != null) {
        req.session.comments = { id_user: url.searchParams.get("id_user") };
    }
    next();
});
router.get(addition_path + "/public/teach.html", (req, res, next) => {
    req.session.comments = undefined;
    next();
});
router.get(addition_path + "/public/index.html", (req, res, next) => {
    req.session.comments = undefined;
    next();
});
router.get(addition_path + "/api_cms", (req, res) => {
    console.log("HERE APICMS GET");
});
router.post(
    "/api_cms",
    upload.array("uploaded_files" /* name attribute of <file> element in your form */),
    (request, response, next) => {
        if (request.method == "POST") {
            var body = "";
            const files = request.files;
            console.log(files);

            if (!files) {
                const error: any = new Error("Please choose files");
                error.httpStatusCode = 400;

                return next(error);
            }
            files.forEach((element) => {
                fs.writeFile(`./server/download/image.jpg`, element.buffer, () => console.log("finished downloading!"));
            });
            response.send(JSON.stringify({ result: false }));
            response.end();
            // request.on("data", function (data) {
            //     body += data;
            //     if (body.length > 1e6) request.connection.destroy();
            // });
            // request.on("end", function () {
            //     console.log("body", body);
            //     // resolve({ result: false });
            //     // var post_data = JSON.parse(body);
            //     // if (request.session.user) {
            //     //     post_data.id_user = request.session.user.id_user;
            //     // }
            //     // application.loadModule(post_data).then((data) => {
            //     // response.send(JSON.stringify(data));
            //     response.send(JSON.stringify({ result: false }));

            //     response.end();
            //     // });
            // });
        }
    }
);
router.post("/api", (request, response) => {
    console.log("request.files", request);
    if (request.method == "POST") {
        var body = "";
        request.on("data", function (data) {
            body += data;
            if (body.length > 1e6) request.connection.destroy();
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

router.post(
    "/send",
    upload.array("file_uploaded" /* name attribute of <file> element in your form */),
    (request, response) => {
        if (request.method == "POST") {
            let attachments = request.files.map((file) => {
                return { filename: file.originalname, content: file.buffer };
            });
            const send_data = {
                from: request.body.address2sender, // sender address
                to: request.body.address2send, // list of receivers
                subject: request.body.subject,
                text: request.body.content,
                attachments: attachments,
            };

            sendEmail(transport_obj, send_data).then((data: send_email_answer) => {
                if (data.result) {
                    const module_info = {
                        module: "Answer",
                        action: "SetTimeAnswering",
                        time: new Date().getTime(),
                        id_question: request.body.id_question,
                    };
                    application.loadModule(module_info).then((data: any) => {
                        if (!data.result) {
                            response.redirect(
                                request.baseUrl + addition_path + "/public/index.html?message=" + data.message
                            );
                        } else {
                            response.redirect(request.baseUrl + addition_path + "/public/index.html");
                        }
                        response.end();
                    });
                } else {
                    response.redirect(
                        request.baseUrl +
                            addition_path +
                            `/public/answer.html?id_question=${request.body.id_question}&message=${data.message}`
                    );
                    response.end();
                }
            });
        }
    }
);
function restrict(req, res, next) {
    if (req.session.user || req.session.comments || req.url.indexOf("bootstrap") != -1) {
        next();
    } else {
        if (req.url != addition_path + "/login" && req.url != addition_path + "/public/login.html") {
            var url = req.baseUrl + addition_path + "/login";
            console.log("Here222", url);
            res.redirect(url);
        } else {
            res.render("login", {
                error: req.session.error,
                success: req.session.success,
            });
        }
    }
}
router.use(restrict);
app.set("view engine", "ejs");
app.set("views", __dirname + addition_path + "/../public/views/");
app.locals.base_path = base_path;
app.locals.addition_path = addition_path;
app.use("/", router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../")));

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});
