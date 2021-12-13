import * as express from 'express';
import { md5 } from "md5";
import * as session from 'express-session';
import { Application } from "./Application";
import * as bodyParser from 'body-parser';
var multer = require('multer');
import * as fs from "fs";
import { sendEmail } from "./modules/lib/functions"
var md5 = require('md5');
const app = express();
const port = 8000;
const basePath = 'http://10.1.4.8:8000';
const path = require('path');
const path2db_sqlite = "./database.db3";
const dsn_cis = {
    user: "cis",
    host: "localhost",
    database: "db_cis",
    password: "cis_passwd",
    port: 5432,
}
const transport_obj = {
    service: 'gmail',
    auth: {
        user: 'mefrit.1999@gmail.com',
        pass: '56189968',
    }
}
const application = new Application(path2db_sqlite, dsn_cis);

const router = express.Router();

function authenticate(login, password, application) {
    return new Promise(async (resolve, reject) => {
        application.getDbConnection().then(async (data: any) => {

            if (data.result) {
                const sql = `SELECT id_user FROM users WHERE login='${login}' AND password='${md5(password.trim())}' `
                data.db_cis.query(sql, (err, res) => {
                    if (err) {
                        resolve({ result: false });
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

                    resolve({ result: false });
                    // resolve({ result: true, rows: res.rows });
                    data.db_cis.end()
                })
            }
        })
    })
}
router.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    secret: 'strange mood'
}));

router.use((req, res, next) => {
    delete req.session.error;
    delete req.session.success;
    next();
});


router.use('/login', bodyParser.urlencoded({
    extended: true,
    type: 'application/x-www-form-urlencoded'
}));
router.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
router.post('/login', (req, res) => {

    authenticate(req.body.username, req.body.password, application).then((answ: any) => {

        if (answ.result) {

            req.session.regenerate(() => {
                req.session.user = { id_user: answ.id_user };
                if (req.url.indexOf("public") == -1) {
                    res.redirect(req.query.back || (req.baseUrl + '/public/stats.html'));
                } else {
                    res.redirect(req.query.back || (req.baseUrl + req.url));
                }

            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';

            res.redirect(req.baseUrl + '/login');
        }
    });
});
router.get('/login', (req, res) => {
    res.render('login', {
        error: req.session.error,
        success: req.session.success
    });
});
router.get("/public/comments.html", (req, res, next) => {
    const url = new URL(req.url, "https://node-http.glitch.me/")
    console.log(url.searchParams.get('id_question') != null, "&&", url.searchParams.get('id_user') != null);
    if (url.searchParams.get('id_question') != null && url.searchParams.get('id_user') != null) {
        req.session.comments = { id_user: url.searchParams.get('id_user') }
    }
    next();

})
router.get("/public/teach.html", (req, res, next) => {

    req.session.comments = undefined;
    next();

})
router.get("/public/index.html", (req, res, next) => {

    req.session.comments = undefined;
    next();

})
router.post('/api', (request, response) => {
    console.log("HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!2222222222")
    if (request.method == 'POST') {

        var body = '';
        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });
        request.on('end', function () {
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

const upload = multer({ storage: multer.memoryStorage() })
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.post('/send', upload.array("file_uploaded" /* name attribute of <file> element in your form */), (request, response) => {
    if (request.method == 'POST') {
        let attachments = request.files.map(file => {
            // console.log(file);
            return { filename: file.originalname, content: file.buffer }
        });
        const send_data = {
            from: request.body.address2sender,  // sender address
            to: request.body.address2send,   // list of receivers
            subject: request.body.subject,
            text: request.body.content,
            attachments: attachments
        }

        sendEmail(transport_obj, send_data).then((data: any) => {
            if (data.result) {
                const module_info = {
                    module: "Answer",
                    action: "SetTimeAnswering",
                    time: new Date().getTime(),
                    id_question: request.body.id_question
                };
                application.loadModule(module_info).then((data: any) => {
                    if (!data.result) {
                        response.redirect(request.baseUrl + '/public/index.html?message=' + data.message);
                    } else {
                        response.redirect(request.baseUrl + '/public/index.html');
                    }
                    response.end();
                });

                // application.setTimeAsnwering(request.body.id_question)

            } else {
                response.redirect(request.baseUrl + `/public/answer.html?id_question=${request.body.id_question}&message=${data.message}`);
                response.end();
            }

        })

    }
});
function restrict(req, res, next) {
    if (req.session.user || req.session.comments || req.url.indexOf("bootstrap") != -1) {
        next();
    } else {
        if ((req.url != "/login" && req.url != "/public/login.html")) {
            var url = req.baseUrl + '/login'
            res.redirect(url);
        } else {
            res.render('login', {
                error: req.session.error,
                success: req.session.success
            });
        }
    }
}
router.use(restrict);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../public/views/');
app.locals.basePath = basePath;

app.use("/", router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "../")));


const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});
