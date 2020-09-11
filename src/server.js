import express from "express";
import bodyParser from "body-parser";
import chalk from "chalk";

import router from "../routes";
import config from "../config/index";
import createMongo from "../utils/mongo";

const app = express();

app.use(express.static(__dirname + "/"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

createMongo();

app.listen(config.port, (err) => {
  console.log(chalk.yellow(`Listening on port ${config.port}`));
});

app.get(`${config.port}/health-check`, (req, res) =>
  res.send({ message: "OK" })
);
