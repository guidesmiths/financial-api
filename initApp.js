const bodyparser = require('body-parser');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');
const path = require('path');

module.exports = (app, controller, config, redisClient, rateLimiter) => {

    const view = () => {
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname + '/index.html'));
        });
    }

    const initUnprotected = () => {
        app.post('/authenticate', (req, res) =>
            controller.verifyUser(req.body.user, req.body.password)
                .then((userData) => {
                    delete userData.password;
                    res.json({
                        message: 'Enjoy your token!',
                        token: jwt.sign(userData, config.app.secretKey , { expiresIn: 60 * 60 })
                    })
                })
                .catch((error) => res.status(401).send({ error }))
        );
    };

    const initProtected = () => {
        app.use(jwtExpress({ secret: config.app.secretKey }));
        app.use(checkRate);
        app.get('/index', (req, res) => {
            controller.getData(req.query)
                .then((data) => { res.json(data) })
        });

         app.get('/indexes', (req, res) => {
            controller.getValues(req.user)
                .then((data) => { res.json(data) })
        });
    };

    const checkRate = rateLimiter.middleware({
        redis: redisClient,
        key: (req) => req.user.id,
        rate: '5/minute'
    });

    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    view();
    initUnprotected();
    initProtected();

};

