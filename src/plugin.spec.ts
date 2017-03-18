import test, { ContextualTestContext } from 'ava';
import * as postcss from 'postcss';

import * as plugin from './plugin';

test('throws if no parameters are supplied in the prelude', t => {
	[
		`a {
			@link-colors;
		}`,
		`a {
			@link-colors {
				visited: b;
			}
		}`
	].forEach(actual => {
		scenario(actual, /Missing color parameter/)(t);
	});
});

test('throws if only red is supplied without a body', t => {
	scenario(
		`a {
			@link-colors red;
		}`,
		/Missing at-rule body. Did you mean @link-colors all red?/
	)(t);
});

test('throws if only the "all" parameter is provided without a color', t => {
	scenario(
		`a {
			@link-colors all;
		}`,
		/Missing color parameter/
	)(t);
});

test('throws if too many parameters are supplied in the prelude', t => {
	scenario(
		`a {
			@link-colors a b c d;
		}`,
		/Too many parameters: b c d/
	)(t);
	scenario(
		`a {
			@link-colors all b c d;
		}`,
		/Too many parameters: c d/
	)(t);
});

test('generates all link-related pseudo-selectors with "all" parameter', t => {
	scenario(
		`a {
			@link-colors all b;
		}`,
		`a {
			color: b;
		}
		a:visited {
			color: b;
		}
		a:focus {
			color: b;
		}
		a:hover {
			color: b;
		}
		a:active {
			color: b;
		}`
	)(t);
});

test('overrides :hover, if specified', t => {
	scenario(
		`a {
			@link-colors b {
				hover: c;
			}
		}`,
		`a {
			color: b
		}
		a:hover {
			color: c;
		}`
	)(t);
});

test('overrides :visited, :focus, :hover and :active', t => {
	scenario(
		`a {
			@link-colors b {
				visited: c;
				focus: f;
				hover: d;
				active: e;
			}
		}`,
		`a {
			color: b
		}
		a:visited {
			color: c;
		}
		a:focus {
			color: f;
		}
		a:hover {
			color: d;
		}
		a:active {
			color: e;
		}`
	)(t);
});

test('preserves the order of :focus in relation to :hover', t => {
	scenario(
		`a {
			@link-colors b {
				hover: d;
				focus: e;
			}
		}`,
		`a {
			color: b
		}
		a:hover {
			color: d;
		}
		a:focus {
			color: e;
		}`
	)(t);
});

test('throws if an unsupported property, foo, is provided', t => {
	scenario(
		`a {
			@link-colors b {
				foo: c;
			}
		}`,
		/Unsupported property: foo/
	)(t);
});

test('appends a pseudo-class with multiple selectors', t => {
	scenario(
		`a, b, c {
			@link-colors all d;
		}`,
		`a, b, c {
			color: d;
		}
		a:visited, b:visited, c:visited {
			color: d;
		}
		a:focus, b:focus, c:focus {
			color: d;
		}
		a:hover, b:hover, c:hover {
			color: d;
		}
		a:active, b:active, c:active {
			color: d;
		}`
	)(t);
});

function scenario(input: string, expectedOutput?: string|RegExp) {
	const processor = postcss([plugin()]);
	return (t: ContextualTestContext) => {
		if (expectedOutput instanceof RegExp) {
			t.throws(() => {
				return processor.process(stripTabs(input)).css;
			}, expectedOutput);
			return;
		}
		t.is(
			processor.process(stripTabs(input)).css,
			stripTabs(<string>expectedOutput)
		);
	};
}

function stripTabs(input: string) {
	return input.replace(/\t/g, '');
}
