const router = require("express").Router();
const mongoose = require("mongoose");
const Store = require("./models/store_model");
const { add_diff, get_ten_stores, filter_stores, search_stores } = require('./helpers');

router.get("/getStores", (req, res) => {
  Store.find({}, (err, all_stores) => {
    if (err) {
      res.status(404).send(err);
    } else {
      search_string = req.body.search;
      filters = req.body.filters;
      results = [];

      if (search_string && filters != null && Object.keys(filters).length) {
        max = 0;
        //search+filter
        search_results = search_stores(all_stores, search_string);
        results = filter_stores(search_results, filters, false);
        max = results.length;
        if (max < 10) {
          //only search
          results = add_diff(search_results, results, 10 - max);
          max = results.length;
          if (max < 10) {
            //only filter
            only_filter = filter_stores(all_stores, filters, true);
            results = add_diff(only_filter, results, 10 - max)
            max = results.length;
          }
        }
        if (max < 10) {
          get_ten_stores(all_stores, results, 10 - max)
        }
      } else if (search_string) {
        results = search_stores(all_stores, search_string);
        if (results.length < 10) {
          get_ten_stores(all_stores, results, 10 - results.length)
        }
      } else if (filters != null && Object.keys(filters).length) {
        results = filter_stores(all_stores, filters, true);

        if (results.length < 10) {
          get_ten_stores(all_stores, results, 10 - results.length)
        }
      } else {
        get_ten_stores(all_stores, results);
      }
      res.status(200).send(results);
    }
  });
});

router.get("/getAllStores", (req, res) => {
  Store.find({}, (err, all_stores) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(all_stores);
    }
  });
})

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
    hours: req.body.hours,
    category: req.body.category,
  });

  NewStore.save((err, doc) => {
    if (err) {
      return res.status(400).send("Cannot save store", err);
    } else {
      return res.status(200).send(`New store with id: ${new_id} created`);
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
    hours: req.body.hours,
    category: req.body.category,
  };

  let changes = !Object.values(update).every((m) => m === null);

  Store.findById(store_id, async (err, found_store) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!found_store) {
      return res.status(404).send("Store not found");
    } else if (changes) {
      for (let [key, value] of Object.entries(update)) {
        if (typeof value !== "undefined") {
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
          } else if (key == "hours") {
            found_store.hours = req.body.hours;
          } else if (key == "category") {
            found_store.category = req.body.category;
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

router.get("/", (req, res) => {
  res.send("FitNut mainpage");
});

router.get("/*", (req, res) => {
  res.status(404).send("404: Page not found");
});
module.exports = router;