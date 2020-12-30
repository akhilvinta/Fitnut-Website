const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Store = require('./models/store_model')


router.get('/', (req, res) => {
    Store.find({}, (err, stores) => {
        if(err){
            console.log(err)
            
        }else{
            res.status(200).send(stores);
        }
    });
});


router.post('/', (req, res) => {
    const store = new Store({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        zip: parseInt(req.body.zip),
        city: req.body.city,
        cost: req.body.cost,
        link: req.body.link,
        desc: req.body.desc
    });
    store.save((err,doc)=>{
        if(err){
            res.status(400).send("Cannot save store")
            return console.log(err)
        }else{
            res.status(200).send("done");
        }
    });
    
});

router.put('/', (req, res) => {

});

router.delete('/:id', (res, req) => {

});

module.exports = router;