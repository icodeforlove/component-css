/**
 * ccss.js v0.0.2
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

	var balanced = __webpack_require__(1),
		cssbeautify = __webpack_require__(2);
	
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 Copyright (C) 2013 Sencha Inc.
	 Copyright (C) 2012 Sencha Inc.
	 Copyright (C) 2011 Sencha Inc.
	
	 Author: Ariya Hidayat.
	
	 Permission is hereby granted, free of charge, to any person obtaining a copy
	 of this software and associated documentation files (the "Software"), to deal
	 in the Software without restriction, including without limitation the rights
	 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 copies of the Software, and to permit persons to whom the Software is
	 furnished to do so, subject to the following conditions:
	
	 The above copyright notice and this permission notice shall be included in
	 all copies or substantial portions of the Software.
	
	 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 THE SOFTWARE.
	*/
	
	/*jslint continue: true, indent: 4 */
	/*global exports:true, module:true, window:true */
	
	(function () {
	
	    'use strict';
	
	    function cssbeautify(style, opt) {
	
	        var options, index = 0, length = style.length, blocks, formatted = '',
	            ch, ch2, str, state, State, depth, quote, comment,
	            openbracesuffix = true,
	            autosemicolon = false,
	            trimRight;
	
	        options = arguments.length > 1 ? opt : {};
	        if (typeof options.indent === 'undefined') {
	            options.indent = '    ';
	        }
	        if (typeof options.openbrace === 'string') {
	            openbracesuffix = (options.openbrace === 'end-of-line');
	        }
	        if (typeof options.autosemicolon === 'boolean') {
	            autosemicolon = options.autosemicolon;
	        }
	
	        function isWhitespace(c) {
	            return (c === ' ') || (c === '\n') || (c === '\t') || (c === '\r') || (c === '\f');
	        }
	
	        function isQuote(c) {
	            return (c === '\'') || (c === '"');
	        }
	
	        // FIXME: handle Unicode characters
	        function isName(c) {
	            return (ch >= 'a' && ch <= 'z') ||
	                (ch >= 'A' && ch <= 'Z') ||
	                (ch >= '0' && ch <= '9') ||
	                '-_*.:#[]'.indexOf(c) >= 0;
	        }
	
	        function appendIndent() {
	            var i;
	            for (i = depth; i > 0; i -= 1) {
	                formatted += options.indent;
	            }
	        }
	
	        function openBlock() {
	            formatted = trimRight(formatted);
	            if (openbracesuffix) {
	                formatted += ' {';
	            } else {
	                formatted += '\n';
	                appendIndent();
	                formatted += '{';
	            }
	            if (ch2 !== '\n') {
	                formatted += '\n';
	            }
	            depth += 1;
	        }
	
	        function closeBlock() {
	            var last;
	            depth -= 1;
	            formatted = trimRight(formatted);
	
	            if (formatted.length > 0 && autosemicolon) {
	                last = formatted.charAt(formatted.length - 1);
	                if (last !== ';' && last !== '{') {
	                    formatted += ';';
	                }
	            }
	
	            formatted += '\n';
	            appendIndent();
	            formatted += '}';
	            blocks.push(formatted);
	            formatted = '';
	        }
	
	        if (String.prototype.trimRight) {
	            trimRight = function (s) {
	                return s.trimRight();
	            };
	        } else {
	            // old Internet Explorer
	            trimRight = function (s) {
	                return s.replace(/\s+$/, '');
	            };
	        }
	
	        State = {
	            Start: 0,
	            AtRule: 1,
	            Block: 2,
	            Selector: 3,
	            Ruleset: 4,
	            Property: 5,
	            Separator: 6,
	            Expression: 7,
	            URL: 8
	        };
	
	        depth = 0;
	        state = State.Start;
	        comment = false;
	        blocks = [];
	
	        // We want to deal with LF (\n) only
	        style = style.replace(/\r\n/g, '\n');
	
	        while (index < length) {
	            ch = style.charAt(index);
	            ch2 = style.charAt(index + 1);
	            index += 1;
	
	            // Inside a string literal?
	            if (isQuote(quote)) {
	                formatted += ch;
	                if (ch === quote) {
	                    quote = null;
	                }
	                if (ch === '\\' && ch2 === quote) {
	                    // Don't treat escaped character as the closing quote
	                    formatted += ch2;
	                    index += 1;
	                }
	                continue;
	            }
	
	            // Starting a string literal?
	            if (isQuote(ch)) {
	                formatted += ch;
	                quote = ch;
	                continue;
	            }
	
	            // Comment
	            if (comment) {
	                formatted += ch;
	                if (ch === '*' && ch2 === '/') {
	                    comment = false;
	                    formatted += ch2;
	                    index += 1;
	                }
	                continue;
	            }
	            if (ch === '/' && ch2 === '*') {
	                comment = true;
	                formatted += ch;
	                formatted += ch2;
	                index += 1;
	                continue;
	            }
	
	            if (state === State.Start) {
	
	                if (blocks.length === 0) {
	                    if (isWhitespace(ch) && formatted.length === 0) {
	                        continue;
	                    }
	                }
	
	                // Copy white spaces and control characters
	                if (ch <= ' ' || ch.charCodeAt(0) >= 128) {
	                    state = State.Start;
	                    formatted += ch;
	                    continue;
	                }
	
	                // Selector or at-rule
	                if (isName(ch) || (ch === '@')) {
	
	                    // Clear trailing whitespaces and linefeeds.
	                    str = trimRight(formatted);
	
	                    if (str.length === 0) {
	                        // If we have empty string after removing all the trailing
	                        // spaces, that means we are right after a block.
	                        // Ensure a blank line as the separator.
	                        if (blocks.length > 0) {
	                            formatted = '\n\n';
	                        }
	                    } else {
	                        // After finishing a ruleset or directive statement,
	                        // there should be one blank line.
	                        if (str.charAt(str.length - 1) === '}' ||
	                                str.charAt(str.length - 1) === ';') {
	
	                            formatted = str + '\n\n';
	                        } else {
	                            // After block comment, keep all the linefeeds but
	                            // start from the first column (remove whitespaces prefix).
	                            while (true) {
	                                ch2 = formatted.charAt(formatted.length - 1);
	                                if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
	                                    break;
	                                }
	                                formatted = formatted.substr(0, formatted.length - 1);
	                            }
	                        }
	                    }
	                    formatted += ch;
	                    state = (ch === '@') ? State.AtRule : State.Selector;
	                    continue;
	                }
	            }
	
	            if (state === State.AtRule) {
	
	                // ';' terminates a statement.
	                if (ch === ';') {
	                    formatted += ch;
	                    state = State.Start;
	                    continue;
	                }
	
	                // '{' starts a block
	                if (ch === '{') {
	                    str = trimRight(formatted);
	                    openBlock();
	                    state = (str === '@font-face') ? State.Ruleset : State.Block;
	                    continue;
	                }
	
	                formatted += ch;
	                continue;
	            }
	
	            if (state === State.Block) {
	
	                // Selector
	                if (isName(ch)) {
	
	                    // Clear trailing whitespaces and linefeeds.
	                    str = trimRight(formatted);
	
	                    if (str.length === 0) {
	                        // If we have empty string after removing all the trailing
	                        // spaces, that means we are right after a block.
	                        // Ensure a blank line as the separator.
	                        if (blocks.length > 0) {
	                            formatted = '\n\n';
	                        }
	                    } else {
	                        // Insert blank line if necessary.
	                        if (str.charAt(str.length - 1) === '}') {
	                            formatted = str + '\n\n';
	                        } else {
	                            // After block comment, keep all the linefeeds but
	                            // start from the first column (remove whitespaces prefix).
	                            while (true) {
	                                ch2 = formatted.charAt(formatted.length - 1);
	                                if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
	                                    break;
	                                }
	                                formatted = formatted.substr(0, formatted.length - 1);
	                            }
	                        }
	                    }
	
	                    appendIndent();
	                    formatted += ch;
	                    state = State.Selector;
	                    continue;
	                }
	
	                // '}' resets the state.
	                if (ch === '}') {
	                    closeBlock();
	                    state = State.Start;
	                    continue;
	                }
	
	                formatted += ch;
	                continue;
	            }
	
	            if (state === State.Selector) {
	
	                // '{' starts the ruleset.
	                if (ch === '{') {
	                    openBlock();
	                    state = State.Ruleset;
	                    continue;
	                }
	
	                // '}' resets the state.
	                if (ch === '}') {
	                    closeBlock();
	                    state = State.Start;
	                    continue;
	                }
	
	                formatted += ch;
	                continue;
	            }
	
	            if (state === State.Ruleset) {
	
	                // '}' finishes the ruleset.
	                if (ch === '}') {
	                    closeBlock();
	                    state = State.Start;
	                    if (depth > 0) {
	                        state = State.Block;
	                    }
	                    continue;
	                }
	
	                // Make sure there is no blank line or trailing spaces inbetween
	                if (ch === '\n') {
	                    formatted = trimRight(formatted);
	                    formatted += '\n';
	                    continue;
	                }
	
	                // property name
	                if (!isWhitespace(ch)) {
	                    formatted = trimRight(formatted);
	                    formatted += '\n';
	                    appendIndent();
	                    formatted += ch;
	                    state = State.Property;
	                    continue;
	                }
	                formatted += ch;
	                continue;
	            }
	
	            if (state === State.Property) {
	
	                // ':' concludes the property.
	                if (ch === ':') {
	                    formatted = trimRight(formatted);
	                    formatted += ': ';
	                    state = State.Expression;
	                    if (isWhitespace(ch2)) {
	                        state = State.Separator;
	                    }
	                    continue;
	                }
	
	                // '}' finishes the ruleset.
	                if (ch === '}') {
	                    closeBlock();
	                    state = State.Start;
	                    if (depth > 0) {
	                        state = State.Block;
	                    }
	                    continue;
	                }
	
	                formatted += ch;
	                continue;
	            }
	
	            if (state === State.Separator) {
	
	                // Non-whitespace starts the expression.
	                if (!isWhitespace(ch)) {
	                    formatted += ch;
	                    state = State.Expression;
	                    continue;
	                }
	
	                // Anticipate string literal.
	                if (isQuote(ch2)) {
	                    state = State.Expression;
	                }
	
	                continue;
	            }
	
	            if (state === State.Expression) {
	
	                // '}' finishes the ruleset.
	                if (ch === '}') {
	                    closeBlock();
	                    state = State.Start;
	                    if (depth > 0) {
	                        state = State.Block;
	                    }
	                    continue;
	                }
	
	                // ';' completes the declaration.
	                if (ch === ';') {
	                    formatted = trimRight(formatted);
	                    formatted += ';\n';
	                    state = State.Ruleset;
	                    continue;
	                }
	
	                formatted += ch;
	
	                if (ch === '(') {
	                    if (formatted.charAt(formatted.length - 2) === 'l' &&
	                            formatted.charAt(formatted.length - 3) === 'r' &&
	                            formatted.charAt(formatted.length - 4) === 'u') {
	
	                        // URL starts with '(' and closes with ')'.
	                        state = State.URL;
	                        continue;
	                    }
	                }
	
	                continue;
	            }
	
	            if (state === State.URL) {
	
	
	                // ')' finishes the URL (only if it is not escaped).
	                if (ch === ')' && formatted.charAt(formatted.length - 1 !== '\\')) {
	                    formatted += ch;
	                    state = State.Expression;
	                    continue;
	                }
	            }
	
	            // The default action is to copy the character (to prevent
	            // infinite loop).
	            formatted += ch;
	        }
	
	        formatted = blocks.join('') + formatted;
	
	        return formatted;
	    }
	
	    if (true) {
	        // Node.js module.
	        module.exports = exports = cssbeautify;
	    } else if (typeof window === 'object') {
	        // Browser loading.
	        window.cssbeautify = cssbeautify;
	    }
	
	}());


/***/ }
/******/ ])
//# sourceMappingURL=ccss.js.map