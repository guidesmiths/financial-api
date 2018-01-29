const express = require('express');
var cors = require('cors')
const mongodb = require('mongodb').MongoClient;
const redis = require('redis');
var rateLimiter = require('redis-rate-limiter');
const initSystem = require('./system');

const app = express();
app.use(cors())
app.use(express.static('public'));

const redisClient = redis.createClient();
redisClient.on("error", console.error);

const args = process.argv;

const config = {
	app: {
		port: process.env.PORT || 8080,
		secretKey: process.env.SECRET_KEY || 'finance'
  },
  mongo: {
    db: 'finance',
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

const system = initSystem({ mongodb, app, config, redisClient, rateLimiter});

system.start()
  .then(() => console.log(`Server listening at localhost:${config.app.port}`))
  .catch(console.error);