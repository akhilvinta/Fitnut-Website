require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 'defaultport',
    MONGO_USER: process.env.MONGO_USER || 'defaultuser',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'defaultpass',
    DBNAME: process.env.DBNAME || 'defaultdb'
}