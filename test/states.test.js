var ccss = require('../index'),
	fs = require('fs');

var examples = {
	states: fs.readFileSync(__dirname + '/examples/states.css', 'utf8')
};

var prefix = 'test-';

describe('Component', function() {
	it('can compile a component using the "state" tag', function() {
		var css = ccss({data: examples.states, prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one.test-one_state-active {\n  width: 100%;\n}\n.test-component.test-one .test-one_content {\n  width: 100%;\n}\n.test-component.test-one.test-one_state-hover.test-one_state-active .test-one_content {\n  width: 100%;\n}\n'
		);
	});
});