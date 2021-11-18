const mongoose = require("mongoose");
const express = require("express");
const { MONGO_USER, MONGO_PASSWORD, DBNAME, PORT } = require("./config");
const app = express();

app.use(express.json());
app.use("/", require("./routes"));

const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://" +
      MONGO_USER +
      ":" +
      MONGO_PASSWORD +
      "@cluster0.qgggw.mongodb.net/" +
      DBNAME +
      "?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
  } catch (e) {
    console.log(err);
    console.log("Could not connect to database. Exiting...");
    process.exit(1);
  }

  console.log("Connected to database");
}

var server = app.listen(parseInt(PORT), () =>
  console.log(`Server started on ${PORT}`)
);

connectToDB();

process.on("exit" || "uncaughtException" || "SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
