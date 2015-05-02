exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  // specs: ['specs/*.spec.js']
  specs: ['specs/admin.spec.js'],
  framework: 'jasmine2',
  jasmineNodeOpts: {
    // If true, display spec names.
    isVerbose: false,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: false,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 30000,
  }
};
