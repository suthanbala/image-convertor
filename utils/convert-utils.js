const { webPEngineMapping } = require('../config/conversion-config');
const fs = require('fs');
const path = require('path');

/**
 * Given the statistic object, we return a shortened version for our logging
 * @param {Object} statistic An object containing the data about the image conversion
 * @returns Object containing the details about the conversion
 */
function conversionLog(statistic) {
    const result = {
        status: 'success'
    };

    // No conversation was done, so stat is undefined
    if (!statistic) {
        result.status = 'error';
        result.message =
            'No conversion was performed, so data is not available.';
        return result;
    }

    // If there was an error, we return that and done
    if (statistic.err) {
        result.status = 'error';
        result.message = statistic.err;
        return result;
    }

    if (!statistic) {
        result.status = 'error';
        result.message =
            'No conversion was done. Possibly the destination already exists';
        return result;
    }

    result.algorithm = statistic.algorithm;
    result.sizeofInput = statistic.size_in;
    result.sizeofOutput = statistic.size_output;
    result.percent = statistic.percent;
    return result;
}

/**
 * Givent the general settings, we return the settings optimizes for the WebP
 * @param {Object} settings General settings
 */
function getWebPSettings(settings) {
    const webPSettings = JSON.parse(JSON.stringify(settings)); // Clone the json

    // Set the engine to webP
    Object.keys(webPSettings).map((key) => {
        if (!!webPEngineMapping[key]) {
            webPSettings[key].engine = webPEngineMapping[key];
            webPSettings[key].command = false;
        }
    });
    return webPSettings;
}

/**
 * Given the absolute path, create it if it doesn't exist
 * @param {string} dirPath absolute path
 */
function createDirectory(dirPath) {
    const fullPath = path.resolve(dirPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
    return fullPath;
}

module.exports = {
    conversionLog,
    getWebPSettings,
    createDirectory
};
