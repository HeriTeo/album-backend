module.exports = {
  mongo: {
    host: "localhost",
    port: "27017",
    dbName: "PHOTO_ALBUM",
    options: {
      // auth: { authSource: " " },
      // user: " ",
      // pass: " ",
      keepAlive: 1000,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
  port: process.env.PORT || 8888,
  version: "0.1.0",
  appDir: {},
  licenseFolder: "license",
};
