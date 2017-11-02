import * as postcss from 'postcss';

const errorContext = {
	plugin: 'postcss-all-link-colors'
};

const pseudoClassesPattern = /^(visited|focus|hover|active)$/;

const PostCssAllLinkColors = postcss.plugin('postcss-all-link-colors', () => {
	return root => {
		root.walkAtRules('link-colors', atRule => {
			const [all, inputColor, ...rest] = postcss.list.space(atRule.params);
			const isColorCloned = all === 'all';
			let color = inputColor;

			if (!isColorCloned) {
				if (color) {
					rest.unshift(color);
				}
				color = all;
			}

			if (!color) {
				throw atRule.error('Missing color parameter', errorContext);
			}

			if (rest.length) {
				throw atRule.error(
					`Too many parameters: ${rest.join(' ')}`,
					errorContext
				);
			}

			const colorDecl = postcss.decl({
				prop: 'color',
				value: color
			});

			atRule.before(colorDecl);

			const overrides: { [key: string]: postcss.Rule; } = {};
			let declarationCount = 0;
			let isFocusBeforeHover = true;
			atRule.walkDecls(pseudoClassesPattern, decl => {
				declarationCount++;
				if (/^(focus|hover)$/.test(decl.prop)) {
					isFocusBeforeHover = decl.prop === 'hover';
				}
				const rule = postcss.rule({
					selector: (<postcss.Rule>atRule.parent).selectors
						.map(selector => {
							return `${selector}:${decl.prop}`;
						})
						.join(', ')
				});
				rule.raws.semicolon = atRule.raws.semicolon;
				rule.append(decl);
				overrides[decl.prop] = rule;
				decl.prop = 'color';
			});

			atRule.walkDecls(decl => {
				throw decl.error(
					`Unsupported property: ${decl.prop}`,
					errorContext
				);
			});

			if (!isColorCloned && declarationCount === 0) {
				throw atRule.error(
					`Missing at-rule body. Did you mean @link-colors all ${color}?`,
					errorContext
				);
			}

			const pseudoClasses = ['visited']
				.concat(isFocusBeforeHover
					? ['focus', 'hover']
					: ['hover', 'focus']
				)
				.concat('active').reverse();
			pseudoClasses.forEach(pseudoClass => {
				const override = overrides[pseudoClass];
				if (override) {
					atRule.parent.after(override);
					return;
				}
				if (!isColorCloned) {
					return;
				}
				const rule = postcss.rule({
					selector: (<postcss.Rule>atRule.parent).selectors
						.map(selector => {
							return `${selector}:${pseudoClass}`;
						})
						.join(', ')
				});
				rule.raws.semicolon = atRule.raws.semicolon;
				rule.append(colorDecl.cloneAfter());
				atRule.parent.after(rule);
			});

			atRule.remove();
		});
	};
});

export = PostCssAllLinkColors;
