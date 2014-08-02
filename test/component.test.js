var ccss = require('../index'),
	fs = require('fs');

var examples = {
	component: fs.readFileSync(__dirname + '/examples/component.css', 'utf8'),
	nested: fs.readFileSync(__dirname + '/examples/component-nested.css', 'utf8'),
	properties: fs.readFileSync(__dirname + '/examples/component-properties.css', 'utf8'),
	pseudoSelectors: fs.readFileSync(__dirname + '/examples/component-pseudo-selectors.css', 'utf8'),
	unnamed: fs.readFileSync(__dirname + '/examples/component-unnamed.css', 'utf8'),
	multiple: fs.readFileSync(__dirname + '/examples/multiple-components.css', 'utf8'),
	multipleNested: fs.readFileSync(__dirname + '/examples/multiple-components-nested.css', 'utf8')
};

var prefix = 'test-';

describe('Component', function() {
	it('can compile a basic component', function() {
		var css = ccss(null, examples.component, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one .test-one_content {\n  width: 100%;\n}'
		);
	});

	it('can compile components with nested selectors', function() {
		var css = ccss(null, examples.nested, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one .test-one_content {\n  width: 100%;\n}\n.test-component.test-one .test-one_content .test-one_one {\n  width: 100%;\n}\n.test-component.test-one .test-one_content .test-one_one .test-one_two {\n  width: 100%;\n}\n.test-component.test-one .test-one_content .test-one_one .test-one_two .test-one_three {\n  width: 100%;\n}'
		);
	});

	it('can compile components with root properties', function() {
		var css = ccss(null, examples.properties, {prefix: prefix});
		console.log(css);
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one {\n  width: 100%;\n  height: 100%;\n}\n.test-component.test-one .test-one_content {\n  width: 100%;\n}\n'
		);
	});

	it('can compile components with root pseudo selectors', function() {
		var css = ccss(null, examples.pseudoSelectors, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one:hover {\n  width: 100%;\n}\n.test-component.test-one:active:hover {\n  width: 100%;\n}\n.test-component.test-one::before {\n  width: 100%;\n}\n.test-component.test-one .test-one_content {\n  width: 100%;\n}\n'
		);
	});

	it('can compile unnamed components', function() {
		var css = ccss('Example', examples.unnamed, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for Example */\n.test-component.test-example .test-example_content {\n  width: 100%;\n}'
		);
	});

	it('can compile multiple components', function() {
		var css = ccss(null, examples.multiple, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one .test-one_content {\n  width: 100%;\n}\n/* Component CSS for Two */\n.test-component.test-two .test-two_content {\n  width: 100%;\n}\n/* Component CSS for Three */\n.test-component.test-three .test-three_content {\n  width: 100%;\n}\n'
		);
	});

	it('can compile multiple components with nested selectors', function() {
		var css = ccss(null, examples.multipleNested, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one .test-one_content {\n  width: 100%;\n}\n.test-component.test-one .test-one_content .test-one_one {\n  width: 100%;\n}\n.test-component.test-one .test-one_content .test-one_one .test-one_two {\n  width: 100%;\n}\n.test-component.test-one .test-one_content .test-one_one .test-one_two .test-one_three {\n  width: 100%;\n}\n/* Component CSS for Two */\n.test-component.test-two .test-two_content {\n  width: 100%;\n}\n.test-component.test-two .test-two_content .test-two_one {\n  width: 100%;\n}\n.test-component.test-two .test-two_content .test-two_one .test-two_two {\n  width: 100%;\n}\n.test-component.test-two .test-two_content .test-two_one .test-two_two .test-two_three {\n  width: 100%;\n}\n/* Component CSS for Three */\n.test-component.test-three .test-three_content {\n  width: 100%;\n}\n.test-component.test-three .test-three_content .test-three_one {\n  width: 100%;\n}\n.test-component.test-three .test-three_content .test-three_one .test-three_two {\n  width: 100%;\n}\n.test-component.test-three .test-three_content .test-three_one .test-three_two .test-three_three {\n  width: 100%;\n}\n'
		);
	});
});