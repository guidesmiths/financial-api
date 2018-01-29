module.exports = (mongo, redis, rateLimiter) => {

    const store = mongo.collection('data');
    const storeUser = mongo.collection('user');

    const getData = ({ name }) => store.findOne({ name });

    const getValues = ({})  => store.find({}).project({name: 1}).toArray();

    const verifyUser = (user, pwd) => storeUser.findOne({name: user});
       /* if (user !== 'user' || pwd !== 'password') throw new Error('User not found');
        return Promise.resolve({
            user,
            random: Math.random() * 1000
        } );
    };*/

    return { getData, getValues, verifyUser };
};
