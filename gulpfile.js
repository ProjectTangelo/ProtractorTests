var gulp = require('gulp');
var runSequence = require('run-sequence');
var protractor = require('gulp-protractor').protractor;

gulp.task('protractor', function (done) {
  gulp.src(['./specs/**/*.js'])
    .pipe(protractor({
      configFile: './protractor-config.js',
      verbose: false,
      includeStackTrace: false
        // args: ['--verbose', 'false',]
    }))
    .on('error', function (e) {
      throw e
    })
    .once('end', done);
});

gulp.task('test', function (done) {
  runSequence('protractor', done);
});

gulp.task('default', function (done) {
  runSequence('test', done);
});
