import del from 'del';

export default function clean(done) {
	del(['lib/**/*.js', 'test/**/*.js', 'd.ts'], done);
}
