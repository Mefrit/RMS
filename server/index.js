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
const port = 8000;
const basePath = 'localhost:8000';
const session = require("express-session");
const bodyParser = require("body-parser");
var md5 = require('md5');
const app = express();
const path = require('path');
const Application_1 = require("./Application");
const path2db_sqlite = "./database.db3";
const dsn_cis = {
    user: "cis",
    host: "localhost",
    database: "db_cis",
    password: "cis_passwd",
    port: 5432,
};
const application = new Application_1.Application(path2db_sqlite, dsn_cis);
const router = express.Router();
function authenticate(login, password, application) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        application.getDbConnection().then((data) => __awaiter(this, void 0, void 0, function* () {
            if (data.result) {
                const sql = `SELECT id_user FROM users WHERE login='${login}' AND password='${md5(password.trim())}' `;
                data.db_cis.query(sql, (err, res) => {
                    if (err) {
                        resolve({ result: false });
                    }
                    if (res === undefined) {
                        resolve({ result: false });
                    }
                    if (res.rows) {
                        if (res.rows.length > 0) {
                            resolve({ result: true, id_user: res.rows[0].id_user });
                        }
                    }
                    resolve({ result: false });
                    data.db_cis.end();
                });
            }
        }));
    }));
}
router.use(session({
    resave: false,
    saveUninitialized: true,
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
    authenticate(req.body.username, req.body.password, application).then((answ) => {
        if (answ.result) {
            req.session.regenerate(() => {
                req.session.user = { id_user: answ.id_user };
                res.redirect(req.query.back || (req.baseUrl + '/public/index.html'));
            });
        }
        else {
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
router.post('/api', (request, response) => {
    if (request.method == 'POST') {
        console.log("q.restrict.user", request.session.user);
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
function restrict(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        if (req.url != "/login" && req.url != "/public/login.html") {
            var url = req.baseUrl + '/public/login.html?back=' + encodeURIComponent(req.originalUrl);
            var url = req.baseUrl + '/login';
            res.redirect(url);
        }
        else {
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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../")));
const server = app.listen(port, (error) => {
    if (error)
        return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});

//# sourceMappingURL=maps/index.js.map
