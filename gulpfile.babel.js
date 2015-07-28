import gulp from 'gulp';
import shell from 'gulp-shell';

gulp.task('default', ['scripts']);
gulp.task('scripts', ['clean', 'lint'], loadTask('scripts'));
gulp.task('scripts--no-clean', ['lint'], loadTask('scripts'));
gulp.task('clean', loadTask('clean'));
gulp.task('lint', loadTask('lint'));
gulp.task('watch', ['scripts'], loadTask('watch'));

function loadTask(taskName) {
	return require(`./.tasks/gulp-${taskName}`);
}
