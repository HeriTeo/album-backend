import mongoose from "mongoose";

import seeder from "mongoose-seed";
import { mongo } from "../config/index";

import { Photo } from "../models/photo.model";
import { generateAlbumDbData } from "../utils/seeder-data";

const mongoURL = `mongodb://${mongo.host}:${mongo.port}/${mongo.dbName}`;

export const startSeeding = async () => {
  const data = await generateAlbumDbData();
  console.log(typeof data[0].path, "is here");
  seeder.connect(mongoURL, function () {
    seeder.loadModels(["./models/photo.model"]);
    seeder.clearModels(["photo"], function () {
      seeder.populateModels(dataTobe, function (err, done) {
        if (err) {
          console.log(err);
        }
        seeder.disconnect();
      });
    });
  });
  const dataTobe = [
    {
      model: "photo",
      documents: data,
    },
  ];
};

startSeeding();
