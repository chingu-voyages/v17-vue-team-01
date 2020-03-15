if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: "mongodb://vue-team-v17:vue-team-v17@ds153113.mlab.com:53113/vue-team-v17",
        secret: 'v17-secret'
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost:27017/vue-team-v17",
        secret: 'v17-secret'
    };
}