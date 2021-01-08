const router = require("express").Router();
const mongoose = require("mongoose");
const { count } = require("./models/store_model");
const Store = require("./models/store_model");

function get_ten_stores(all_stores, results, num) {
  all_stores.forEach((val, index) => {
    if (index < 10) {

      exists = results.every(s => {
        return val._id.toString() != s._id.toString();
      })
      if (exists) {
        results.push(val);
      }
    }
  })
}

function add_diff(arr1, arr2, num) {
  if (arr1.length == 0) {
    return arr2;
  }
  temp = [];
  arr1.forEach((s, index) => {
    exists = arr2.every((fs) => {
      return fs._id.toString() != s._id.toString();
    });
    if (exists) {
      if (num != null && index <= num) {
        temp.push(s);
      } else {
        temp.push(s);
      }

    }
  });
  return arr2.concat(temp);
}

function filter_stores(docs, filters, mongo) {
  filters_entries = Object.entries(filters);
  filtered_stores = [];
  arr = [];
  docs.map((x) => {
    if (mongo) {
      arr.push(x.toObject())
    } else {
      arr.push(x)
    }
  });

  while (filters_entries.length != 0) {
    temp = [];
    arr.map((d) => {
      d_array = Object.entries(d);
      result = filters_entries.every((f) => {
        index_key = Object.keys(d).indexOf(f[0]);
        if (index_key && d_array[index_key][1] === f[1]) {
          return temp.every((t) => t._id.toString() != d._id.toString());
        }
      });
      if (result) {
        temp.push(d);
      }
    });
    if (temp.length) {
      filtered_stores = add_diff(temp, filtered_stores);
    }
    filters_entries.pop();
  }
  return filtered_stores;
}

function search_stores(docs, search_string) {
  words = search_string.split(" ");
  search_results = [];
  var count = [];
  arr = [];
  docs.map((x) => arr.push(x.toObject()));
  for (i = 0; i < arr.length; i++) {
    count[i] = [0, arr[i]];
  }

  words.forEach(word => {
    for (i = 0; i < count.length; i++) {
      vals = Object.values(count[i][1]);
      c = 0;
      vals.forEach(val => {
        val = val.toString();
        field_words = val.split(" ");
        field_words.forEach(fd => {
          if (fd.toUpperCase().includes(word.toUpperCase())) {
            c++;
          }
        })
      })
      count[i][0] += c;
    }
  })

  count.sort((a, b) => {
    return b[0] - a[0];
  })

  count.forEach((val, index) => {

    if (index < 10 && val[0] > 0) {
      search_results.push(val[1])
    }
  })
  return search_results;
}

router.get("/", (req, res) => {
  res.send("FitNut mainpage");
});

router.get("/getStores", (req, res) => {
  Store.find({}, (err, all_stores) => {
    if (err) {
      res.status(404).send(err);
    } else {
      search_string = req.body.search;
      filters = req.body.filters;
      results = [];
      console.log('filters', filters);

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
        get_ten_stores(all_stores, results, 10 - results.length)
      } else if (filters != null && Object.keys(filters).length) {
        results = filter_stores(all_stores, filters, true);
        get_ten_stores(all_stores, results, 10 - results.length)
      } else {
        get_ten_stores(all_stores, results);
      }
      res.status(200).send(results);
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
