// tang.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['frontTest.js']
  /*
  multiCapabilities: [{
    browserName: 'firefox'
  }, {
    browserName: 'chrome'
  }]
  */
}