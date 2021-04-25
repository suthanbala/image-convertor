const { compress } = require('compress-images/promise');
const {
    losslessConversion,
    lossyConversion,
    defaultSource,
    defaultDestination
} = require('./config/conversion-config');
const { conversionLog, getWebPSettings } = require('./utils/convert-utils');

// Run the function and convert everything
async function convertImages(source, destination, isLossyConversion = true) {
    if (!source) {
        source = defaultSource;
    }
    if (!destination) {
        destination = defaultDestination;
    }

    console.log(`Running Image optimizer..`);
    const converionModeStr = isLossyConversion
        ? 'Lossy conversion'
        : 'Lossless conversion';
    const currentSettings = isLossyConversion
        ? lossyConversion
        : losslessConversion;
    const webPSettings = getWebPSettings(currentSettings);

    // Conversion log
    let results = [];

    // Non webP conversion
    let promiseResult = await compress({
        source: source.nonWebP,
        destination: destination.nonWebP,
        enginesSetup: currentSettings
    });
    let { statistics } = promiseResult;
    results = { ...results, ...statistics.map((stat) => conversionLog(stat)) };

    // webP conversion
    promiseResult = await compress({
        source: source.webP,
        destination: destination.webP,
        enginesSetup: webPSettings
    });
    statistics = promiseResult.statistics;
    results = { ...results, ...statistics.map((stat) => conversionLog(stat)) };

    console.log('**Results**', results);
    console.log(`Images optimized. Mode: ${converionModeStr}`);
    return results;
}

module.exports = {
    convertImages
};
