var balanced = require('node-balanced'),
	cssbeautify = require('cssbeautify');

function toHyphenDelimited (string) {
	return string.replace(/([a-z][A-Z])/g, function (g) {
		return g[0] + '-' + g[1];
	}).toLowerCase();
}

function parseComponents (name, css, config) {
	var headRegExp = /\@component\s*([^\{]+|)\s*\{/,
		trimRegExp = /^\s*(.+?)\s*$/igm,
		multipleLinesRegExp = /\n{2,}/;

	return balanced.replacements({
	    source: css,
	    head: headRegExp,
	    open: '{',
	    close: '}',
	    replace: function (source, head, tail) {
			var componentName = head.match(headRegExp)[1].trim() || name;

			source = cssbeautify(source, {autosemicolon: true});

			source = source.replace(trimRegExp, '$1');
			source = source.replace(/\}/g, '}\n');
			source = parseComponent(toHyphenDelimited(componentName), source, config);
			source = cssbeautify(source, {autosemicolon: true, indent: config.spacing});
			source = source.replace(/\n{2,}/g, '\n');

			if (config.header) {
				var header = '/* Component CSS for ' + componentName + ' */\n';
				source = header + source;
			}

			return source;
	    }
	});
}

function parseComponent (name, css, config) {
	css = replaceSelectors(name, css, config);
	css = replaceComponentPseudoSelectors(name, css, config);
	css = replaceComponentProperties(name, css, config);

	return css.trim();
}

function replaceSelectors(name, css, config) {
	var selectorRegExp = /((?:[\@a-z0-9\-\_\.\:\*\#\>\[\]])(?:[a-z0-9\%\-\_\+\.\:\s\*\[\]\=\'\"\,\(\)\#\\\>\~]+)?)(?:\s+)?([\{\[])/gi,
		componentRegExp = /^(?!.*state\:\:|\:|self)(\S+)(?!.*state\:\:)/,
		selfRegExp = /\bself\b/,
		classRegExp = new RegExp('([#\\.])(?!' + config.prefix + ')([a-z0-9\\-_]*)', 'ig');

	return css.replace(selectorRegExp, function (match, selectors) {
		selectors = selectors.split(',').map(function (selector) {
			// remove white spaces
			selector = selector.trim();

			// prefix selectors with component class
			selector = selector.replace(componentRegExp, '.' + config.prefix + 'component.' + config.prefix + name + ' $1');
			selector = selector.replace(selfRegExp, '.' + config.prefix + 'component.' + config.prefix + name);

			// prefix selectors that have states with component and state classes
			selector = replaceStateSelector(name, selector, config);

			// prefix all remaining selectors that are not already
			selector = selector.replace(classRegExp, '$1' + config.prefix + name + '_$2');

			return selector.trim();
		});

		return selectors.join(', ') + ' {';
	});
}

function replaceStateSelector (name, selector, config) {
	var componentStateRegExp = /state\:\:(\S+)/,
		stateSelector;

	selector = selector.replace(componentStateRegExp, function (match, states) {
		states = states.split('::').map(function (state) {
			return '.' + config.prefix + name + '_state-' + state;
		});

		stateSelector = states.join('');

		return '';
	});

	if (stateSelector) {
		selector = '.' + config.prefix + 'component.' + config.prefix + name + stateSelector + ' ' + selector;
	}

	return selector;
}

function replaceComponentPseudoSelectors (name, css, config) {
	var pseudoRegExp = /^\s*(\:\S+)\s*\{/gim;

	// fast way to detect block locations
	var blocks = balanced.matches({
        source: css,
        open: '{',
        close: '}'
    });

	return css.replace(pseudoRegExp, function (match, selector, index, source) {
		// if we are nested we should skip this step
		for (var i = 0; i < blocks.length; i++) {
			if (index >= blocks[i].index && (index + match.length) <= (blocks[i].index + blocks[i].length)) {
				return match;
			}
		}

		return '.' + config.prefix + 'component.' + config.prefix + name + selector + ' {';
	});
}

function replaceComponentProperties(name, css, config) {
	var propertyRegExp = /^([\@a-z0-9\-\_\.\:\*\#][a-z0-9\-\_\.\:\s\*\[\]\=\'\"\,\(\)\#]*)(?:\s+)?:\s*(.+);$/gim,
		componentProperties = '';

	// fast way to detect block locations
	var blocks = balanced.matches({source: css, open: '{', close: '}'});

	css = css.replace(propertyRegExp, function (match, name, value, index, source) {
		// if we are nested we should skip this step
		for (var i = 0; i < blocks.length; i++) {
			if (index >= blocks[i].index && (index + match.length) <= (blocks[i].index + blocks[i].length)) {
				return match;
			}
		}

		componentProperties += name + ': ' + value + ';\n';

		return '';
	});

	if (componentProperties) {
		css = '.' + config.prefix + 'component.' + config.prefix + name + ' {\n' + componentProperties.trim() + '\n}\n' + css;
	}

	return css;
}

module.exports = function (name, css, config) {
	config = config || {};
	config.prefix = config.prefix || '';
	config.spacing = config.spacing || '  ';
	config.header = config.header !== undefined ? config.header : true;
	parseComponents(name, css, config);
	return parseComponents(name, css, config);
};