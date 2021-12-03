"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const session = require("express-session");
const bodyParser = require("body-parser");
function route(self, router) {
    function restrict(req, res, next) {
        if (req.session.user) {
            next();
        }
        else {
            var url = req.baseUrl + '/login?back=' + encodeURIComponent(req.originalUrl);
            res.redirect(url);
        }
    }
    function authenticate(username, password) {
        if (username === 'admin' && password === '12345') {
            return { name: 'admin' };
        }
    }
    router.use('/login', bodyParser.urlencoded({
        extended: true,
        type: 'application/x-www-form-urlencoded'
    }));
    router.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'strange mood'
    }));
    router.get('/logout', (req, res) => {
        delete req.session.user;
        res.redirect(req.baseUrl + '/login');
    });
    router.use((req, res, next) => {
        res.locals.user = req.session.user;
        next();
    });
    router.get('/login', (req, res) => {
        res.render('login', {
            error: req.session.error,
            success: req.session.success
        });
    });
    router.use((req, res, next) => {
        delete req.session.error;
        delete req.session.success;
        next();
    });
    router.post('/login', (req, res) => {
        let user = authenticate(req.body.username, req.body.password);
        if (user) {
            req.session.regenerate(() => {
                req.session.user = user;
                res.redirect(req.query.back || (req.baseUrl + '/rooms'));
            });
        }
        else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect(req.baseUrl + '/login');
        }
    });
    router.use(restrict);
    router.get('/destroy/:meetingId', (req, res) => {
        let meetingId = parseInt(req.params.meetingId, 10);
        self.janusClient.destroyRoom(meetingId);
    });
    router.get('/meetings/:meetingId', (req, res) => {
        let meetingId = parseInt(req.params.meetingId, 10);
        const meeting = self.wsapp.meetings.find(m => m ? m.id == meetingId : false);
        if (meeting) {
            const users = meeting.listUsers();
            self.janusClient.getParticipants(meetingId).then((result) => {
                var type = req.accepts(['html', 'json']);
                if (type == 'json') {
                    res.json(users);
                }
                else {
                    let j = JSON.stringify(result.plugindata.data);
                    res.render('meeting', { meeting, users, participants: j });
                }
            });
        }
        else {
            res.render('meeting', { meetingId });
        }
    });
    return router;
}
exports.route = route;

//# sourceMappingURL=../maps/route/user.js.map
