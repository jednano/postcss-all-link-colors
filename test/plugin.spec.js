import { expect } from 'chai';
import postcss from 'postcss';
import plugin from '../lib/plugin';
// ReSharper disable WrongExpressionStatement
describe('@link-colors at-rule', () => {
    it('throws if no parameters are supplied in the prelude', () => {
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
            check(actual, /Missing color parameter/);
        });
    });
    it('throws if only red is supplied without a body', () => {
        check(`a {
				@link-colors red;
			}`, /Missing at-rule body. Did you mean @link-colors all red?/);
    });
    it('throws if only the "all" parameter is provided without a color', () => {
        check(`a {
				@link-colors all;
			}`, /Missing color parameter/);
    });
    it('throws if too many parameters are supplied in the prelude', () => {
        check(`a {
				@link-colors a b c d;
			}`, /Too many parameters: b c d/);
        check(`a {
				@link-colors all b c d;
			}`, /Too many parameters: c d/);
    });
    it('generates all link-related pseudo-selectors with "all" parameter', () => {
        check(`a {
				@link-colors all b;
			}`, `a {
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
			}`);
    });
    it('overrides :hover, if specified', () => {
        check(`a {
				@link-colors b {
					hover: c;
				}
			}`, `a {
				color: b
			}
			a:hover {
				color: c;
			}`);
    });
    it('overrides :visited, :focus, :hover and :active', () => {
        check(`a {
				@link-colors b {
					visited: c;
					focus: f;
					hover: d;
					active: e;
				}
			}`, `a {
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
			}`);
    });
    it('preserves the order of :focus in relation to :hover', () => {
        check(`a {
				@link-colors b {
					hover: d;
					focus: e;
				}
			}`, `a {
				color: b
			}
			a:hover {
				color: d;
			}
			a:focus {
				color: e;
			}`);
    });
    it('throws if an unsupported property, foo, is provided', () => {
        check(`a {
				@link-colors b {
					foo: c;
				}
			}`, /Unsupported property: foo/);
    });
    it('appends a pseudo-class with multiple selectors', () => {
        check(`a, b, c {
				@link-colors all d;
			}`, `a, b, c {
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
			}`);
    });
});
function check(actual, expected) {
    const processor = postcss().use(plugin);
    actual = stripTabs(actual);
    if (expected instanceof RegExp) {
        expect(() => {
            processor.process(actual).css;
        }).to.throw(expected);
        return;
    }
    expect(processor.process(actual).css).to.equal(stripTabs(expected));
}
function stripTabs(input) {
    return input.replace(/\t/g, '');
}
