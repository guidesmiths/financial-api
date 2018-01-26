const bodyparser = require('body-parser');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');

module.exports = (app, controller, config) => {

    const initUnprotected = () => {
        app.post('/authenticate', (req, res) =>
            controller.verifyUser(req.body.user, req.body.password)
                .then((userData) => res.json({
                        message: 'Enjoy your token!',
                        token: jwt.sign(userData, config.app.secretKey , { expiresIn: 60 * 60 })
                    }))
                .catch((error) => res.status(401).send({ error }))
        );
    };

    const initProtected = () => {
        app.use(jwtExpress({ secret: config.app.secretKey }));
        app.get('/index', (req, res) => {
            controller.getData(req.query)
                .then((data) => {res.json(data) })
        });

         app.get('/indexes', (req, res) => {
            console.log(req.user)
            controller.getValues(req.user)
                .then((data) => { console.log(data); res.json(data) })
        });
    };

    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    initUnprotected();
    initProtected();
};