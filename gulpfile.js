var gulp = require('gulp');
var mocha = require('gulp-mocha');
var batch = require('gulp-batch');

gulp.watch(['*.js'], batch(function(events, cb) {
	return gulp.src(['test.js'])
		.pipe(mocha({
			reporter: 'spec'
		}))
		.on('error', function(err) {
			console.log(err.stack);
		});
}));

gulp.task('default', function () {
    return gulp.src('test.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
});
