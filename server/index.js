"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const port = 8000;
const basePath = 'localhost:8000';
const dsn_cis = {
    user: "cis",
    host: "localhost",
    database: "db_cis",
    password: "cis_passwd",
    port: 5432,
};
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const Application_1 = require("./Application");
const path2db = "./database.db3";
const application = new Application_1.Application(path2db);
const router = express.Router();
function authenticate(username, password) {
    console.log("username, password", username, password);
    if (username === 'admin' && password === '123') {
        return { login: 'admin' };
    }
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
    let user = authenticate(req.body.username, req.body.password);
    if (user) {
        req.session.regenerate(() => {
            req.session.user = user;
            res.redirect(req.query.back || (req.baseUrl + '/public/index.html'));
        });
    }
    else {
        req.session.error = 'Authentication failed, please check your '
            + ' username and password.';
        res.redirect(req.baseUrl + '/login');
    }
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
