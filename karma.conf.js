module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-software-rasterizer', '--disable-dev-shm-usage']
      }
    },
    browsers: ['ChromeHeadlessCI']
  });
};
