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
exports.add_diff = add_diff

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
exports.get_ten_stores = get_ten_stores

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
            match = filters_entries.every((f) => {
                index_key = Object.keys(d).indexOf(f[0]);
                filter_arr = f[1];
                present = filter_arr.every(fe => {
                    if (index_key >= 0 && typeof d_array[index_key][1] === "object") {
                        category_arr = d_array[index_key][1];
                        return category_arr.includes(fe);
                    }
                    else if (index_key >= 0 && d_array[index_key][1] === fe) {
                        return true;
                    }
                    return false;
                })
                return present;
            });

            no_duplicate = temp.every((t) => {
                return t._id.toString() != d._id.toString()
            });

            if (match && no_duplicate) {
                temp.push(d);
            }
        });

        filtered_stores = add_diff(temp, filtered_stores);
        filters_entries.pop();
    }
    return filtered_stores;
}
exports.filter_stores = filter_stores

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
                if (typeof val === "object")
                    return;
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
exports.search_stores = search_stores
