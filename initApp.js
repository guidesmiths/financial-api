const bodyparser = require('body-parser');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');

module.exports = (app, controller, config) => {
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());

    app.post('/authenticate', (req, res) => {
        if(req.body.user !== 'user' || req.body.password !== 'password') return res.status(401).send({message: '401 bad email'});
        return res.json({
            success: true,
            message: 'Enjoy your token!',
            token: jwt.sign({ user: 'user' }, config.app.secretKey , { expiresIn: 60 * 60 })
        });
    });

    app.use(jwtExpress({ secret: config.app.secretKey }));

    app.get('/test', (req, res) => {
        controller.getData()
            .then((data) => res.json(data))
    });
};