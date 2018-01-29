const express = require('express');
var cors = require('cors')
const mongodb = require('mongodb').MongoClient;
const redis = require('redis');
var rateLimiter = require('redis-rate-limiter');
const initSystem = require('./system');

const app = express();
app.use(cors())
app.use(express.static('public'));

const args = process.argv;

const config = {
  app: {
    port: process.env.PORT || 8080,
		secretKey: process.env.SECRET_KEY || 'finance',
  },
  rateLimiter: {
    number: 5,
    rate: '5/minute'
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  mongo: {
    db: 'finance',
    host: process.env.MONGO_HOST || '127.0.0.1',
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

const redisClient = redis.createClient(config.redis);
redisClient.on("error", console.error);

const system = initSystem({ mongodb, app, config, redisClient, rateLimiter});

system.start()
  .then(() => console.log(`Server listening at localhost:${config.app.port}`))
  .catch(console.error);