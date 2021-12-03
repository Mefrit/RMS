import * as express from 'express';
import * as session from 'express-session';
import * as request from 'request';
import * as bodyParser from 'body-parser'

export function route(self, router) {


    function restrict(req, res, next) {
        if (req.session.user /*|| req.hostname == 'localhost'*/) {
            next();
        } else {
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
        resave: false, // don't save session if unmodified
        saveUninitialized: true, // don't create session until something stored
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
            // Regenerate session when signing in
            // to prevent fixation          
            req.session.regenerate(() => {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in self case the entire user object
                req.session.user = user;
                res.redirect(req.query.back || (req.baseUrl + '/rooms'));
            });
        } else {
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

    // Информауия о мероприятии
    router.get('/meetings/:meetingId', (req, res) => {
        let meetingId = parseInt(req.params.meetingId, 10);
        const meeting = self.wsapp.meetings.find(m => m ? m.id == meetingId : false);
        if (meeting) {
            const users = meeting.listUsers();
            self.janusClient.getParticipants(meetingId).then((result: any) => {
                var type = req.accepts(['html', 'json']);
                if (type == 'json') {
                    res.json(users);
                } else {
                    let j = JSON.stringify(result.plugindata.data);
                    res.render('meeting', { meeting, users, participants: j });
                }
            });
        } else {
            res.render('meeting', { meetingId });
        }

        //res.send(req.params.meetingId);
        //let u = new Message();
        //u.text = JSON.stringify(self.wsapp.meetings.filter(meeting => meeting !== null),
        //        function( key, value) { if (key == "connection") return "__"; return value; }
        //    );
        //res.send(u.text);
    });

    return router;
}
