import fs from "fs-extra";
import path from "path";

export const readFolderByPath = async (pathString) => {
  return await new Promise((resolve, reject) => {
    fs.readdir(path.join(pathString), (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
};

export const isDirectoryByPath = (pathString) => {
  return fs.lstatSync(pathString).isDirectory();
};

export const readFileByPath = async (pathString) => {
  return await new Promise((resolve, reject) => {
    fs.readFile(path.join(pathString), (err, file) => {
      if (err) {
        reject(err);
      }

      resolve(file);
    });
  });
};

export const createFileByPath = async (fullname, oldPath) => {
  fs.readFile(oldPath, function (err, data) {
    fs.writeFile(fullname, data, function (err) {
      fs.unlink(oldPath, function () {});
    });
  });
};
