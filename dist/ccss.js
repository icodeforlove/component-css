/**
 * ccss.js v0.0.0
 */
var ccss =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var balanced = __webpack_require__(1);
	
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
	
				source = source.replace(trimRegExp, '$1');
				source = parseComponent(toHyphenDelimited(componentName), source, config);
				source = source.replace(/\n{2,}/, '\n');
	
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
	
		return css;
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
	
				return selector.trim('');
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
					return config.spacing + match;
				}
			}
	
			componentProperties += config.spacing + name + ': ' + value + ';\n';
	
			return '';
		});
	
		if (componentProperties) {
			css = '.' + config.prefix + 'component.' + config.prefix + name + ' {\n' + config.spacing + componentProperties.trim() + '\n}\n' + css;
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Note: this currently doesn't support nested replacements because its meant to be 
	// greedy and grab the first head all the way to the last
	function Balanced (config) {
		config = config || {};
		
		if (!config.open) throw new Error('Balanced: please provide a "open" property');
		if (!config.close) throw new Error('Balanced: please provide a "close" property');
	
		this.head = config.head || config.open;
		this.balance = config.balance || false;
		this.exceptions = config.exceptions || false;
		this.close = config.close;
		this.open = config.open;
	}
	
	Balanced.prototype = {
		/**
		 * Escapes a string to be used within a RegExp
		 * @param  {String} string
		 * @return {String}
		 */
		escapeRegExp: function (string) {
		  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},
	
		/**
		 * Matches contents
		 * 
		 * @param  {String} string
		 * @return {String}
		 */
		matchContentsInBetweenBrackets: function (string) {
			var caseInsensitive = this.head instanceof RegExp && this.head.ignoreCase,
				headRegExp = this.head instanceof RegExp ? this.head : new RegExp(this.escapeRegExp(this.head)),
				openRegExp = this.open instanceof RegExp ? this.open : new RegExp(this.escapeRegExp(this.open)),
				closeRegExp = this.close instanceof RegExp ? this.close : new RegExp(this.escapeRegExp(this.close)),
				regex = new RegExp(
					headRegExp.source + '|' + 
					openRegExp.source + '|' + 
					closeRegExp.source,
					'g' + (caseInsensitive ? 'i' : '')
				),
				matches = [],
				matchedOpening = null,
				depth = 0,
				match,
				balanced = true;
	
			while ((match = regex.exec(string))) {
				if (!matchedOpening && match[0].match(headRegExp) && (!this.balance || this.balance && !depth)) {
					matchedOpening = match;
					depth = this.balance ? depth + 1 : 1;
				} else if (match[0].match(openRegExp)) {
					depth++;
				} else if (match[0].match(closeRegExp)) {
					depth--;
				}
	
				if (this.balance && depth < 0) {
					balanced = false;
					if (this.exceptions) {
						throw new Error ('Balanced: expected open bracket at ' + match.index);
					}
					break;
				}
		 
				if (matchedOpening !== null && depth === 0) {
					matches.push({
						index: matchedOpening.index, 
						length: match.index + match[0].length - matchedOpening.index,
						head: matchedOpening[0],
						tail: match[0]
					});
					matchedOpening = null;
				}
			}
			if (this.balance) {
				if (this.exceptions && !(balanced && depth === 0)) {
					throw new Error ('Balanced: expected close bracket at ' + (string.length -1));
				}
				return balanced && depth === 0 ? matches : null;
			} else {
				return matches;
			}
		},
	
		/**
		 * Non-destructive match replacements.
		 * 
		 * @param  {Array} matches
		 * @param  {String} string
		 * @param  {Function} replace
		 * @return {String}
		 */
		replaceMatchesInString: function (matches, string, replace) {
			var offset = 0;
			
			for (var i = 0; i < matches.length; i++) {
				var match = matches[i],
					replacement = replace(string.substr(match.index + offset + match.head.length, match.length - match.head.length - match.tail.length), match.head, match.tail);
				string = string.substr(0, match.index + offset) + replacement + string.substr(match.index + offset + match.length, (string.length) - (match.index + offset + match.length));
				
				offset += replacement.length - match.length;
			}
			
			return string;
		},
	
		/**
		 * Runs replace function against matches, and source.
		 * 
		 * @param  {String} string
		 * @param  {Function} replace
		 * @return {String}
		 */
		replaceMatchesInBetweenBrackets: function (string, replace) {
			var matches = this.matchContentsInBetweenBrackets(string);
			return this.replaceMatchesInString(matches, string, replace);
		}
	};
	
	exports.replaceMatchesInString = Balanced.prototype.replaceMatchesInString; 
	
	exports.replacements = function (config) {
		config = config || {};
	
		var balanced = new Balanced({
			head: config.head,
			open: config.open,
			close: config.close,
			balance: config.balance,
			exceptions: config.exceptions
		});
	
		if (!config.source) throw new Error('Balanced: please provide a "source" property');
		if (typeof config.replace !==  'function') throw new Error('Balanced: please provide a "replace" function');
	
		return balanced.replaceMatchesInBetweenBrackets(config.source, config.replace);
	};
	
	exports.matches = function (config) {
		var balanced = new Balanced({
			head: config.head,
			open: config.open,
			close: config.close,
			balance: config.balance,
			exceptions: config.exceptions
		});
	
		if (!config.source) throw new Error('Balanced: please provide a "source" property');
	
		return balanced.matchContentsInBetweenBrackets(config.source);
	};

/***/ }
/******/ ])
//# sourceMappingURL=ccss.js.map