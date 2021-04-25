const { webPEngineMapping } = require('../config/conversion-config');

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
    result.sizeofInput = statistic.size_input;
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
        } else {
            delete webPSettings[key];
        }
    });
    return webPSettings;
}

module.exports = {
    conversionLog,
    getWebPSettings
};
