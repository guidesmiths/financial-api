module.exports = (mongo, redis) => {

    const store = mongo.collection('data');

    const getData = () => store.findOne({ episode_id: 4 });

    return { getData };
};