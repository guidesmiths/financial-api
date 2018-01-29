const initApp = require('./initApp');
const initController = require('./controller');

module.exports = ({ mongodb, app, config, redisClient, rateLimiter }) => {

  let server;
  let mongoInstance;
  let controller;

  const start = () =>
    mongodb.connect(`mongodb://${config.mongo.host}/finance`, config.mongo.options)
      .then((mongo) => {
        console.log('Connected to mongo DB!');
        server = app.listen(config.app.port);
        mongoInstance = mongo;
        controller = initController(mongo.db(config.mongo.db), redisClient, rateLimiter);
        initApp(app, controller, config, redisClient, rateLimiter);
        return { app, controller };
      });

  const stop = () =>
    mongoInstance.close()
      .then(() => server.close());

  return {
    start,
    stop
  };

};