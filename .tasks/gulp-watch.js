import gulp from 'gulp';

export default function watch() {
	gulp.watch('src/**/*.ts', ['scripts--no-clean']);
}
