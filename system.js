module.exports = ({ mongodb, app, config }) => {

  let server;
  let mongoInstance;

  console.log(config.mongo)
  const start = () =>
    mongodb.connect('mongodb://127.0.0.1/finance', config.mongo.options)
      .then((mongo) => {
        server = app.listen(config.app.port);
        mongoInstance = mongo;
        console.log('Connected to mongo DB!');
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