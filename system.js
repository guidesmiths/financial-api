const initApp = require('./initApp');
const initController = require('./controller');

module.exports = ({ mongodb, app, config, redis }) => {

  let server;
  let mongoInstance;
  let controller;

  const start = () =>
    mongodb.connect('mongodb://127.0.0.1/finance', config.mongo.options)
      .then((mongo) => {
        console.log('Connected to mongo DB!');
        server = app.listen(config.app.port);
        mongoInstance = mongo;
        controller = initController(mongo.db(config.mongo.db), redis);
        initApp(app, controller, config);
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