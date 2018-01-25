const initApp = require('./initApp');

module.exports = ({ mongodb, app, config, redis }) => {

  let server;
  let mongoInstance;

  const start = () =>
    mongodb.connect('mongodb://127.0.0.1/finance', config.mongo.options)
      .then((mongo) => {
        server = app.listen(config.app.port);
        mongoInstance = mongo;
        console.log('Connected to mongo DB!');
        initApp(app);
        return { mongo, app };
      });

  const stop = () =>
    mongoInstance.close()
      .then(() => server.close());

  return {
    start,
    stop
  };

};