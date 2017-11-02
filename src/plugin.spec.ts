import test, { TestContext } from 'ava';
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
		macro(t, actual, /Missing color parameter/);
	});
});

test('throws if only red is supplied without a body', macro,
	`a {
		@link-colors red;
	}`,
	/Missing at-rule body. Did you mean @link-colors all red?/
);

test('throws if only the "all" parameter is provided without a color', macro,
	`a {
		@link-colors all;
	}`,
	/Missing color parameter/
);

test('throws if too many parameters are supplied in the prelude', t => {
	macro(t,
		`a {
			@link-colors a b c d;
		}`,
		/Too many parameters: b c d/
	);
	macro(t,
		`a {
			@link-colors all b c d;
		}`,
		/Too many parameters: c d/
	);
});

test('generates all link-related pseudo-selectors with "all" parameter', macro,
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
);

test('overrides :hover, if specified', macro,
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
);

test('overrides :visited, :focus, :hover and :active', macro,
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
);

test('preserves the order of :focus in relation to :hover', macro,
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
);

test('throws if an unsupported property, foo, is provided', macro,
	`a {
		@link-colors b {
			foo: c;
		}
	}`,
	/Unsupported property: foo/
);

test('appends a pseudo-class with multiple selectors', macro,
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
);

function macro(
	t: TestContext,
	input: string,
	expectedOutput?: string | RegExp
) {
	const processor = postcss([plugin()]);
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
	function stripTabs(input: string) {
		return input.replace(/\t/g, '');
	}
}
