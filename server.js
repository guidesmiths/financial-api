const express = require('express');
const mongodb = require('mongodb');
const redis = require('redis');
const client = redis.createClient();
const bodyparser = require('body-parser');

//const jwt = require('express-jwt');
const jwt = require('jsonwebtoken');

client.on("error", function (err) {
    console.log("Error " + err);
});

/*client.set("string key", "string val", redis.print);

client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
});*/

const initSystem = require('./system');

const app = express();
const args = process.argv;

const config = {
	app: {
		port: process.env.PORT || 8080,
		secretKey: process.env.SECRET_KEY || 'finance'
  },
  mongo: {
    options: {
      auth: {
        user: process.env.MONGO_DB_APP_USERNAME || 'node',
        password: process.env.MONGO_DB_APP_PASSWORD || 'node'
      },
      keepAlive: true,
      reconnectTries: 30,
      socketTimeoutMS: 0
    }
  }
};


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

/*app.get('/proteted', jwt({secret: config.app.secretKey}),  (req,res) => {
	res.sendStatus(200);
})*/

app.post('/authenticate', (req,res) => {
	if(req.body.user !== 'user' || req.body.password !== 'password') return res.status(401).send({message: '401 bad email'});
	return res.json({
		          success: true,
		          message: 'Enjoy your token!',
		          token: jwt.sign({ user: 'user'}, config.app.secretKey , { expiresIn: 60 * 60 })
        		});
})

const system = initSystem({ mongodb, app, config });

system.start()
  .then(() => console.log(`Server listening at localhost:${config.app.port}`))
  .catch(console.error);