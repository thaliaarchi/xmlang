var convert = require('xml-js');
var xml = require('fs').readFileSync('pi.xml', 'utf8');

var result = convert.xml2js(xml, {
  compact: false,
  trim: true,
  ignoreComment: true,
  alwaysChildren: true,
  elementsKey: 'children',
  textKey: 'values',
  cdataKey: 'values',
  textFn: processText,
  cdataFn: processText
});

function processText(text) {
  return processValues(text, []);
}

function processValues(text, values) {
  if (!text) {
    return values;
  }
  const wordMatch = text.match(/^(.+?)(?:\s+|$)/);
  if (!wordMatch) {
    throw 'Text matching error: ' + text;
  }

  // String
  if (/^["']/.test(text)) {
    const stringMatch = text.match(/^("(?:[^\\"]|\\.)*"|'(?:[^\\']|\\.)*')(?:\s+|$)/);
    if (!stringMatch) {
      throw 'Invalid string: ' + text;
    }
    const unquoted = stringMatch[1].slice(1, -1);
    return processValues(text.slice(stringMatch[0].length), [...values, unquoted]);
  }

  // Number
  else if (/^[\d.+-]/.test(text)) {
    // Integer or float with optional exponent and/or unit
    const numberMatch = text.match(/^([+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?)([a-zA-Z]*)(?:\s+|$)/);
    if (!numberMatch) {
      throw 'Invalid number: ' + text;
    }
    // Implement units
    return processValues(text.slice(numberMatch[0].length), [...values, +numberMatch[1]]);
  }

  // Identifier
  else {
    // Implement identifiers
    return processValues(text.slice(wordMatch[0].length), [...values, 'IDENT_' + wordMatch[1]]);
  }
}

console.log(JSON.stringify(result, null, 2));
