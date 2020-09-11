import mongoose from "mongoose";

import { photos } from "./seeders/photos.seeder";
import { mongo } from "./config/index";

const mongoURL = `mongodb://${mongo.host}:${mongo.port}/${mongo.dbName}`;
console.log(mongoURL, "mongoURL");
/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = { photos };
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
