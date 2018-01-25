module.exports = (mongo, redis) => {

    const store = mongo.collection('data');

    const getData = ({ favEpisode }) => store.findOne({ episode_id: favEpisode });

    const verifyUser = (user, pwd) => {
        if (user !== 'user' || pwd !== 'password') throw new Error('User not found');
        return Promise.resolve({
            user,
            favEpisode: 4,
            random: Math.random() * 1000
        });
    };

    return { getData, verifyUser };
};