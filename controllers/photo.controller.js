import path from "path";
import fs from "fs-extra";
import { pick, omitBy, isUndefined, indexOf, findIndex } from "lodash";

import Photo from "../models/photo.model";
import { createFileByPath } from "../utils/common-functiom";

async function list(req, res, next) {
  try {
    // since method was post
    const { skip: postSkip, limit: postLimit } = req.body;
    const criteria = {};
    const select = " -createdAt -updatedAt";
    if (!postSkip && !postLimit && !querySkip && !queryLimit) {
      res.status(400).json({
        message: "skip and limit field are required",
      });
    }
    const targetList = await Photo.find(omitBy(criteria, isUndefined))
      .sort({ createdAt: -1 })
      .select(select)
      .limit(postLimit)
      .skip(postSkip)
      .lean();

    if (!targetList) {
      res.status(400).json({
        message: "listing photo error",
      });
    }

    res.status(200).json({
      message: "OK",
      documents: targetList,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message ? error.message : "error",
    });
  }
}

async function update(req, res, next) {
  try {
    const { album: albumName } = req.body;
    const { documents: multiFileData } = req.files;
    if (!albumName) {
      res.status(400).json({
        message: "album are required",
      });
    }
    const validExtensionName = [
      ".jpg",
      ".png",
      ".webp",
      ".gif",
      ".tiff",
      ".raw",
    ];
    const targetPathName = `/albums/${albumName}/`;
    const targetRawName = `http://localhost:8888/photos/${albumName.toLowerCase()}/`;

    let dataSet = [];

    if (multiFileData.length > 0) {
      //validation
      for (let i = 0; i < multiFileData.length; i++) {
        const targetElement = multiFileData[i];
        const targetExtnName = path.extname(targetElement.originalFilename);
        const existedName = await Photo.find({
          name: targetElement.originalFilename,
        })
          .count()
          .exec();
        if (existedName > 0) {
          res.status(400).json({
            message: `${targetElement.originalFilename} file name already exist`,
          });
        }
        if (indexOf(validExtensionName, targetExtnName) == -1) {
          res.status(400).json({
            message: `${targetExtnName} format are currently are not supported`,
          });
        }
      }
      //processing
      for (let i = 0; i < multiFileData.length; i++) {
        const targetElement = multiFileData[i];

        const targetSavePath = `${__dirname}/..${targetPathName}${targetElement.originalFilename}`;

        const newPhotoData = await new Promise((resolve, reject) => {
          let newDataFile = new Photo({
            album: albumName,
            name: targetElement.originalFilename,
            path: `${targetPathName}${targetElement.originalFilename}`,
            raw: `${targetRawName}${targetElement.originalFilename}`,
          });
          newDataFile.save((err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        await createFileByPath(targetSavePath, targetElement.path);
        let resultResponse = {
          album: newPhotoData.album,
          name: newPhotoData.name,
          path: newPhotoData.path,
          raw: newPhotoData.raw,
        };
        dataSet.push(resultResponse);
      }
    }

    res.status(200).json({
      message: "OK",
      data: dataSet,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function remove(req, res, next) {
  try {
    const inputArray = req.body;

    if (Object.prototype.toString.call(inputArray) == "[object Array]") {
      let removeTaskError = [];
      for (let i = 0; i < inputArray.length; i++) {
        const element = inputArray[i];
        const targetAlbumName = element.album.toLowerCase();
        const targetAlbumNameCapLetter = element.album;
        const documentsArr = element.documents.split(/[\s,]+/);
        for (let j = 0; j < documentsArr.length; j++) {
          const targetFileame = documentsArr[j];

          const targetPathName = `/albums/${targetAlbumName}/${targetFileame}`;
          const targetPathNameCapLetter = `/albums/${targetAlbumNameCapLetter}/${targetFileame}`;
          const targetDirPath = `${__dirname}/..${targetPathName}`;

          const removeTask = await Photo.findOneAndDelete({
            path: `${targetPathNameCapLetter}`,
          }).exec();
          if (!removeTask) {
            removeTaskError.push(`'${targetPathName}'`);
          } else {
            fs.unlinkSync(targetDirPath);
          }
        }
      }

      if (removeTaskError.length > 0) {
        const pathListString = removeTaskError.join();
        res.status(400).json({
          message: `delete photo at path : ${pathListString}`,
        });
      }

      res.status(200).json({
        message: "OK",
      });
    } else {
      if (!req.url.slice(1)) {
        res.status(400).json({
          message: `album and filename not found in url: "${req.url}"`,
        });
      }
      const getUrlString = req.url.slice(1).split("/");

      if (getUrlString.length != 2) {
        res.status(400).json({
          message: `either album or filename not found in url: '${req.url}'`,
        });
      }
      const targetAlbumName = getUrlString[0].toLowerCase();
      const targetAlbumNameCapLetter = getUrlString[0];
      const targetFileame = getUrlString[1];

      const targetPathName = `/albums/${targetAlbumName}/${targetFileame}`;
      const targetPathNameCapLetter = `/albums/${targetAlbumNameCapLetter}/${targetFileame}`;
      const targetDirPath = `${__dirname}/..${targetPathName}`;

      if (!fs.existsSync(targetDirPath)) {
        res.status(400).json({
          message: `file at path '${targetPathName}' not found`,
        });
      }

      fs.unlinkSync(targetDirPath);

      const removeTask = await Photo.findOneAndDelete({
        path: `${targetPathNameCapLetter}`,
      }).exec();
      if (!removeTask) {
        res.status(400).json({
          message: `delete photo at path '${targetPathName}'`,
        });
      }

      res.status(200).json({
        message: "OK",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message ? error.message : "error",
    });
  }
}

async function getData(req, res, next) {
  try {
    if (!req.url.slice(1)) {
      res.status(400).json({
        message: `album and filename not found in url: "${req.url}"`,
      });
    }
    const getUrlString = req.url.slice(1).split("/");

    if (getUrlString.length != 2) {
      res.status(400).json({
        message: `either album or filename not found in url: '${req.url}'`,
      });
    }
    const targetAlbumName = getUrlString[0].toLowerCase();
    const targetFileame = getUrlString[1];

    const targetPathName = `/albums/${targetAlbumName}/${targetFileame}`;
    const targetDirPath = `${__dirname}/..${targetPathName}`;

    if (!fs.existsSync(targetDirPath)) {
      res.status(400).json({
        message: `file at path '${targetPathName}' not found`,
      });
    }

    res.sendFile(path.resolve(targetDirPath));
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message ? error.message : "error",
    });
  }
}

export default {
  list,
  update,
  remove,
  getData,
};
