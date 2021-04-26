const archiver = require('archiver');
const fs = require('fs');

/**
 * Return the environment variable, ${defaultValue} if not available
 * @param {string} key Environment value you want to pull
 * @param {string} defaultVal If not available, then return this
 * @returns Return the environment variable for the given key
 */
function getEnv(key, defaultVal) {
    if (!process.env[key]) {
        return defaultVal;
    }
    return process.env[key];
}

/**
 * Given the request object, we return the relative path they should upload to
 * @param {Request} req Request object
 * @returns Relative path to the user's folder
 */
function getUserDirectory(req) {
    const relativePath = `/${req.user.session}`;
    return relativePath;
}

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', (err) => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

module.exports = {
    getEnv,
    getUserDirectory,
    zipDirectory
};
