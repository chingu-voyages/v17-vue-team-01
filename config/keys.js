if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: "mongodb+srv://vue-team-v17:v17-secret@cluster0-quwyt.mongodb.net/vue-team-v17",
        secret: 'v17-secret'
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost:27017/vue-team-v17",
        secret: 'v17-secret'
    };
}