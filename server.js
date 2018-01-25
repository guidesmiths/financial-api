const express = require('express');
const mongodb = require('mongodb');
const redis = require('redis');

const initSystem = require('./system');

const app = express();
const client = redis.createClient();
client.on("error", console.error);

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

const system = initSystem({ mongodb, app, config, redis });

system.start()
  .then(() => console.log(`Server listening at localhost:${config.app.port}`))
  .catch(console.error);