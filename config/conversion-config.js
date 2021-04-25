// Default quality if lossy setting was given
const lossyQuality = 80;
const isLossyConversion = process.env.CONVERSION_MODE === 'lossy';
const converionModeStr = isLossyConversion
    ? 'Lossy conversion'
    : 'Lossless conversion';

// Plugin setting for the lossless conversion
const losslessConversion = {
    jpg: {
        engine: 'mozjpeg',
        command: ['-quality', '100']
    },
    png: {
        engine: 'pngquant',
        command: ['--quality=100', '-o']
    },
    svg: {
        engine: 'svgo',
        command: '--multipass'
    },
    gif: {
        engine: 'gifsicle',
        command: ['--colors', '64', '--use-col=web']
    }
};

// Settings for lossy conversion
const lossyConversion = {
    jpg: {
        engine: 'mozjpeg',
        command: ['-quality', lossyQuality]
    },
    png: {
        engine: 'pngquant',
        command: [`--quality=${lossyQuality - 30}-${lossyQuality}`, '-o']
    },
    svg: {
        engine: 'svgo',
        command: '--multipass'
    },
    gif: {
        engine: 'gifsicle',
        command: ['--colors', '64', '--use-col=web']
    }
};

// Engines to use when converting to webP
const webPEngineMapping = {
    jpg: 'webp',
    png: 'webp',
    gif: 'gif2webp'
};

const defaultSource = {
    nonWebP: 'src/**/*.{jpg,png, gif, svg}',
    webP: 'src/**/*.{jpg,png, gif}'
};

const defaultDestination = {
    nonWebP: 'build/non-webP/',
    webP: 'build/webP/'
};

module.exports = {
    isLossyConversion,
    converionModeStr,
    losslessConversion,
    lossyConversion,
    webPEngineMapping,
    defaultSource,
    defaultDestination
};
