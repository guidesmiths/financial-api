module.exports = (mongo, redis, rateLimiter) => {

    const store = mongo.collection('data');
    const storeUser = mongo.collection('user');

    const getData = ({ name }) => store.findOne({ name });

    const getValues = ({})  => store.find({}).project({name: 1}).toArray();

    const verifyUser = (user, pwd) => storeUser.findOne({ name: user, password: pwd });

    return { getData, getValues, verifyUser };
};
