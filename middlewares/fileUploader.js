const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { createDirectory } = require('../utils/convert-utils');
const { getUserDirectory, zipDirectory } = require('../utils/utils');
const { convertImages } = require('../convert');
const { uploadsPath, compressedPath } = require('../config/web-config');

function createStorage(storagePath) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, storagePath); //here we specify the destination. in this case i specified the current directory
        },
        filename: function (req, file, cb) {
            console.log(file); //log the file object info in console
            cb(null, file.originalname); //here we specify the file saving name. in this case.
            //i specified the original file name .you can modify this name to anything you want
        }
    });
    const upload = multer({ storage });
    return upload;
}

/**
 * Once the user is authenticated and the file is updloaded, we move it to
 * the uploads/{sessionId}. Then we compress + convert and place them under
 * the public/sessionID folder
 * @param {Request} req Request Object
 * @param {Response} res Responsive Object
 */
const processUploadedFile = async (req, res) => {
    /*** File is uploaded, now let's do the processing **/
    // Create the session directory if it doesn't exist
    const relativePath = getUserDirectory(req);
    const absPath = createDirectory(`${uploadsPath}/${relativePath}`);
    const destinationPath = `${compressedPath}${relativePath}`;
    const imagePath = path.resolve(req.file.path);

    const newPath = path.resolve(absPath, req.file.filename);

    // Move file over
    await fs.promises.rename(imagePath, newPath, (err) => {
        if (err) {
            console.log(err);
        }
    });

    const srcPath = {
        nonWebP: `${uploadsPath}${relativePath}/**/*.{jpg,png, gif, svg}`,
        webP: `${uploadsPath}${relativePath}/**/*.{jpg,png, gif}`
    };
    const destPath = {
        nonWebP: `${destinationPath}/non-webp/`,
        webP: `${destinationPath}/webp/`
    };

    const logs = await convertImages(srcPath, destPath, true);
    res.json(logs);
};

const archiveFolder = async (req, res) => {
    const relativePath = getUserDirectory(req);
    const sourceFolder = `${compressedPath}/${relativePath}`;
    const destination = `${compressedPath}/${relativePath}.zip`;

    await zipDirectory(sourceFolder, destination);
    res.json({
        path: destination
    })
};

module.exports = {
    createStorage,
    processUploadedFile,
    archiveFolder
};
