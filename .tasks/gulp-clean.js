import del from 'del';

export default function clean(done) {
	del(['lib', 'test', 'd.ts'], done);
}
