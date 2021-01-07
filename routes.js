const router = require("express").Router();
const mongoose = require("mongoose");
const Store = require("./models/store_model");

function add_diff(arr1, arr2) {
  if(arr1.length==0){
    return;
  }
  temp = [];
  arr1.forEach((s) => {
    result = arr2.every((farray) =>
      farray.every((fs) => {
        return fs._id.toString() != s._id.toString();
      })
    );
    if (result) {
      temp.push(s);
    }
  });
  arr2.push(temp);
}

function filter_stores(docs, filters_obj) {
  arr = [];
  docs.map((x) => arr.push(x.toObject()));
  filters = Object.entries(filters_obj);
  filtered_stores = [];

  while (filters.length != 0) {
    temp = [];
    arr.map((d) => {
      d_array = Object.entries(d);
      result= filters.every((f) => {
        index_key = Object.keys(d).indexOf(f[0]);
        if (index_key && d_array[index_key][1] === f[1]) {          
          return temp.every((t) => t._id.toString() != d._id.toString());
        }
      });
      console.log(d.name,result)
      if(result){
        temp.push(d);
      }
    });
    
      add_diff(temp, filtered_stores);
        
    filters.pop();
  }
  add_diff(arr, filtered_stores);
  return filter_stores;
}

router.get("/", (req, res) => {
  res.send("FitNut mainpage");
});

router.get("/getStores", (req, res) => {
  Store.find({}, (err, stores) => {
    if (err) {
      res.status(404).send(err);
    } else {
      filter_obj = {
        cost: "low",
        zip:"1234"
      };
      //filter_stores(stores, filter_obj);
      res.status(200).send(stores);
    }
  });
});

router.post("/addStore", (req, res) => {
  let new_id = new mongoose.Types.ObjectId();
  const NewStore = new Store({
    _id: new_id,
    name: req.body.name,
    address: req.body.address,
    zip: parseInt(req.body.zip),
    city: req.body.city,
    cost: req.body.cost,
    link: req.body.link,
    desc: req.body.desc,
  });
  NewStore.save((err, doc) => {
    if (err) {
      return res.status(400).send("Cannot save store", err);
    } else {
      res.status(200).send(`New store with id: ${new_id} created`);
    }
  });
});

router.put("/updateStore", (req, res) => {
  var store_id = req.body.id;
  let update = {
    name: req.body.name,
    address: req.body.address,
    zip: req.body.zip,
    city: req.body.city,
    cost: req.body.cost,
    link: req.body.link,
    desc: req.body.desc,
  };

  let changes = !Object.values(update).every((m) => m === null);

  Store.findById(store_id, (err, found_store) => {
    if (!found_store) {
      return res.status(404).send("Store not found");
    } else if (changes) {
      for (let [key, value] of Object.entries(update)) {
        if (typeof value !== "undefined") {
          console.log(`${key}: ${value}`);
          if (key == "name") {
            found_store.name = req.body.name;
          } else if (key == "address") {
            found_store.address = req.body.address;
          } else if (key == "zip") {
            found_store.zip = parseInt(req.body.zip);
          } else if (key == "city") {
            found_store.city = req.body.city;
          } else if (key == "cost") {
            found_store.cost = req.body.cost;
          } else if (key == "link") {
            found_store.link = req.body.link;
          } else if (key == "desc") {
            found_store.desc = req.body.desc;
          }
        }
      }

      found_store.save((err, updated_store) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.status(200).send(updated_store);
        }
      });
    } else {
      return res.status(200).send(`No changes made to store of id:${store_id}`);
    }
  });
});

router.delete("/removeStore/:id", (req, res) => {
  var store_id = req.params.id;

  Store.deleteOne({ _id: store_id }, (err) => {
    if (err) {
      res.status(500).send(`Unable to delete store of id: ${store_id}`, err);
    } else {
      res.status(200).send(`Deleted store with id: ${store_id}`);
    }
  });
});

router.get("/*", (req, res) => {
  res.status(404).send("404: Page not found");
});

module.exports = router;
