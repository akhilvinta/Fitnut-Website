const mongoose = require("mongoose");
const express = require("express");
const { MONGO_USER, MONGO_PASSWORD, DBNAME, PORT } = require("./config");
const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://" +
    MONGO_USER +
    ":" +
    MONGO_PASSWORD +
    "@cluster0.qgggw.mongodb.net/" +
    DBNAME +
    "?retryWrites=true&w=majority",
  {
    useMongoClient: true,
  }
);
app.use("/", require("./routes"));


var server = app.listen(parseInt(PORT), () =>
  console.log(`server started on ${PORT}`)
);

process.on("exit" || "uncaughtException" || "SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
