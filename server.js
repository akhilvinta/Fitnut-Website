const mongoose = require('mongoose');
const express = require('express');
const { MONGO_USER, MONGO_PASSWORD, DBNAME, PORT } = require('./config')
const app = express();
app.use(express.json());

console.log(MONGO_USER, MONGO_PASSWORD, DBNAME, PORT)
mongoose.connect('mongodb+srv://' + MONGO_USER + ':' + MONGO_PASSWORD + '@cluster0.qgggw.mongodb.net/' + DBNAME + '?retryWrites=true&w=majority', {
    useMongoClient: true
})

app.use('/api/stores', require('./routes'));
app.get('/', (req, res) => {
    res.send("FitNut mainpage")
})
app.get('/*', (req, res) => {
    res.status(404).send("404: Page not found")
})
app.listen(PORT, () => console.log(`server started on ${PORT}`));

