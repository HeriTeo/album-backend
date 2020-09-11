import path from "path";
import { readFolderByPath, isDirectoryByPath } from "../utils/common-functiom";

export const generateAlbumDbData = async () => {
  try {
    const resultData = [];
    const directoryPath = path.join(__dirname, "../albums");
    const folderPhysicalList = await readFolderByPath(directoryPath);
    let physicalDataFile = [];

    for (let folderName in folderPhysicalList) {
      const pathString = `${directoryPath}/${folderPhysicalList[folderName]}`;
      const typeOfList = isDirectoryByPath(pathString);

      if (typeOfList) {
        const dataReaded = await readFolderByPath(pathString);
        const nameOfAlbum = `${folderPhysicalList[folderName]}`;
        const objTobe = {
          album: nameOfAlbum.charAt(0).toUpperCase() + nameOfAlbum.slice(1),
          fileList: dataReaded,
        };
        physicalDataFile.push(objTobe);
      }
    }
    // end check dir
    // start generate data list - of checked directory result
    for (let i = 0; i < physicalDataFile.length; i++) {
      const element = physicalDataFile[i];
      for (let j = 0; j < element.fileList.length; j++) {
        const elementFile = element.fileList[j];
        const nameToLoweCase = element.album.toLowerCase();
        const resultTobe = {
          album: element.album,
          name: elementFile,
          path: `/albums/${element.album}/${elementFile}`,
          raw: `http://localhost:8888/photos/${nameToLoweCase}/${elementFile}`,
        };
        resultData.push(resultTobe);
      }
    }

    return resultData;
  } catch (error) {
    console.log(error);
  }
};
