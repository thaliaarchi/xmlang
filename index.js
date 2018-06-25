const convert = require('xml-js');
const fs = require('fs');

const reduce = func => args => args.reduce(func);
const map =    func => args => args.map(func);
const every =  func => args => args.every(func);

const operators = {
  add: reduce((a, b) => a + b),
  sub: reduce((a, b) => a - b),
  mul: reduce((a, b) => a * b),
  div: reduce((a, b) => a / b),
  mod: reduce((a, b) => a % b),
  exp: reduce((a, b) => Math.pow(a, b)),
  num: map(a => +a),
  neg: args => args.length > 1 ? args.map(a => -a) : -args[0],
  abs: map(a => Math.abs(a)),

  eq:  every((a, i, arr) => a == arr[0]),
  neq: every((a, i, arr) => a != arr[0]),
  gt:  every((a, i, arr) => a > arr[0]),
  lt:  every((a, i, arr) => a < arr[0]),
  gte: every((a, i, arr) => a >= arr[0]),
  lte: every((a, i, arr) => a <= arr[0]),

  not: map(a => !a),
  and: reduce((a, b) => a && b),
  or:  reduce((a, b) => a || b)
};

const ast = parseAST(parseXML(readFile('pi.xml')));
console.log(JSON.stringify(ast, null, 2));
console.log(evaluate(ast).pop());

function evaluate(ast) {
  return ast.map(node => {
    switch (node.type) {
      case 'expression':
        return operators[node.name](evaluate(node.nodes));
      case 'string':
      case 'number':
      case 'identifier':
        return node.value;
    }
  })
}

function readFile(file) {
  return fs.readFileSync(file, 'utf8');
}

function parseXML(xml) {
  return convert.xml2js(xml, {
    compact: false,
    trim: true,
    ignoreComment: true,
    ignoreDeclaration: true,
    ignoreDoctype: true,
    alwaysChildren: true,
    instructionHasAttributes: true,
    elementsKey: 'children',
    textKey: 'value',
    cdataKey: 'value'
  });
}

function parseAST(tree) {
  let nodes = [];
  for (let child of tree.children) {
    switch (child.type) {
      case 'element':
        nodes.push({
          type: 'expression',
          name: child.name,
          nodes: parseAST(child)
        });
        break;
      case 'text':
      case 'cdata':
        nodes.push(...parseText(child.value, []));
        break;
      default:
        nodes.push({ type: 'error' });
    }
  }
  return nodes;
}

function parseText(text, values) {
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
    return parseText(text.slice(stringMatch[0].length), [...values, {
      type: 'string',
      value: unquoted
    }]);
  }

  // Number
  else if (/^[\d.+-]/.test(text)) {
    // Integer or float with optional exponent and/or unit
    const numberMatch = text.match(/^([+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?)([a-zA-Z]*)(?:\s+|$)/);
    if (!numberMatch) {
      throw 'Invalid number: ' + text;
    }
    // Implement units
    return parseText(text.slice(numberMatch[0].length), [...values, {
      type: 'number',
      value: +numberMatch[1]
    }]);
  }

  // Identifier
  else {
    // Implement identifiers
    return parseText(text.slice(wordMatch[0].length), [...values, {
      type: 'identifier',
      value: wordMatch[1]
    }]);
  }
}
