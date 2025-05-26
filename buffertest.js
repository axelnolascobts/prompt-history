const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>


console.log(Buffer.from('1ag123', 'hex'));
// Prints <Buffer 1a>, data truncated when first non-hexadecimal value
// ('g') encountered.

console.log(Buffer.from('1a7', 'hex'));
// Prints <Buffer 1a>, data truncated when data ends in single digit ('7').

console.log(Buffer.from('1634', 'hex'));
// Prints <Buffer 16 34>, all data represented.

const buf1 = Buffer.from('ABC');

for (const byte of buf1) {
  console.log(byte);
}