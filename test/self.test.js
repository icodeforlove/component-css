var ccss = require('../index'),
	fs = require('fs');

var examples = {
	self: fs.readFileSync(__dirname + '/examples/self.css', 'utf8')
};

var prefix = 'test-';

describe('Component', function() {
	it('can compile a component using the "self" tag', function() {
		var css = ccss(null, examples.self, {prefix: prefix});
		expect(css).toEqual(
			'/* Component CSS for One */\n.test-component.test-one {\n  width: 100%;\n}\n.test-component.test-one:hover {\n  width: 100%;\n}\n'
		);
	});
});