const { compress } = require('compress-images/promise');
const compress_images = require('compress-images');
const {
    losslessConversion,
    lossyConversion,
    defaultSource,
    defaultDestination
} = require('./config/conversion-config');
const { conversionLog, getWebPSettings } = require('./utils/convert-utils');

function compressImagesWrapper(src, dest, engines) {
    const engineObjects = [];
    Object.keys(engines).map(key => {
        engineObjects.push({
            [key]: engines[key]
        })
    });
    
    return new Promise((resolve, reject) => {
        compress_images(src, dest, { compress_force: false, statistic: true, autoupdate: true }, true,
            ...engineObjects,
            function (error, completed, statistic) {
                resolve({error, statistic, completed})

                if (error) {
                    console.log('ERROR', error)
                    reject(error);
                }
            }
        );
    });
}

// Run the function and convert everything
async function convertImages(source, destination, isLossyConversion = true) {
    if (!source) {
        source = defaultSource;
    }
    if (!destination) {
        destination = defaultDestination;
    }

    const converionModeStr = isLossyConversion
        ? 'Lossy conversion'
        : 'Lossless conversion';
    const currentSettings = isLossyConversion
        ? lossyConversion
        : losslessConversion;
    // const webPSettings = (currentSettings);
    const webPSettings = getWebPSettings(currentSettings);

    // Conversion log
    let results = [];

    let log 


    // Non webp 
    log = await compressImagesWrapper(source.nonWebP, destination.nonWebP, currentSettings)
    results.push(conversionLog(log.statistic));

    // WebP
    log = await compressImagesWrapper(source.webP, destination.webP, webPSettings)
    results.push(conversionLog(log.statistic));

    console.log('**Results**', results);
    console.log(`Images optimized. Mode: ${converionModeStr}`);
    return results;
}

module.exports = {
    convertImages
};
