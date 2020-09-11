import mongoose from "mongoose";
import { mongo } from "../config/index";
import chalk from "chalk";

export default () => {
  mongoose.Promise = global.Promise;

  mongoose.connect(
    `mongodb://${mongo.host}:${mongo.port}/${mongo.dbName}`,
    mongo.options
  );

  const db = mongoose.connection;

  db.once("open", () => {
    console.log(chalk.green("Successfully connection to the database"));
  });

  db.on("error", function (error) {
    console.error(chalk.red("Error in database connection: " + error));
    mongoose.disconnect();
  });

  return db;
};
