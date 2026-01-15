const fs = require('fs');
const esprima = require('esprima');

try {
    const code = fs.readFileSync('app.js', 'utf-8');
    const result = esprima.parseModule(code);
    console.log('✓ File parsed successfully!');
} catch (error) {
    console.log('✗ Parse error:', error.message);
    if (error.lineNumber) console.log('  at line:', error.lineNumber);
    if (error.column) console.log('  at column:', error.column);
    if (error.description) console.log('  Description:', error.description);
}
