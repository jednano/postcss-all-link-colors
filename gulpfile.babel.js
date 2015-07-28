import gulp from 'gulp';

function loadTask(taskName) {
	return require(`./.tasks/gulp-${taskName}`);
}

gulp.task('default', ['scripts']);
gulp.task('scripts', ['clean', 'lint'], loadTask('scripts'));
gulp.task('scripts--no-clean', ['lint'], loadTask('scripts'));
gulp.task('clean', loadTask('clean'));
gulp.task('lint', loadTask('lint'));
gulp.task('watch', ['scripts'], loadTask('watch'));
