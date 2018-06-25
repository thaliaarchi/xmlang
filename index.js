const convert = require('xml-js');
const fs = require('fs');

const reduce = func => (...args) => args.reduce(func);
const map =    func => (...args) => args.map(func);
const every =  func => (...args) => args.every(func);

const operators = {
  // Arithmetic https://www.gnu.org/software/emacs/manual/html_node/elisp/Arithmetic-Operations.html
  add: (...numbers) => numbers.reduce((a, b) => a + b, 0),
  sub: (...numbers) => numbers.length ? (numbers.length === 1 ? -numbers[0] : numbers.reduce((a, b) => a - b)) : 0,
  mul: (...numbers) => numbers.length ? numbers.reduce((a, b) => a * b) : 1,
  div: (number, ...divisors) => divisors.length ? divisors.reduce((dividend, divisor) => dividend / divisor, number) : 1 / number,
  rem: (dividend, divisor) => dividend % divisor,
  mod: (dividend, divisor) => ((dividend % divisor) + divisor) % divisor,

  abs: (...numbers) => numbers.map(number => Math.abs(number)),
  neg: (...numbers) => numbers.length > 1 ? numbers.map(a => -a) : -numbers[0],
  expt: (base, exp) => Math.pow(base, exp),

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

const keywords = {
  true: true,
  false: false,
  undef: undefined,
  null: null,
  Inf: Infinity,
  NaN: NaN
};

const ast = parseAST(parseXML(readFile('pi.xml')));
console.log(JSON.stringify(ast, null, 2));
console.log(evaluate(ast).pop());

let tests = require('./tests');
tests.forEach(test => test.actual = evaluate(test.ast).pop());
tests = tests.filter(test => test.out !== test.actual);
console.log(JSON.stringify(tests, null, 2));

function evaluate(ast) {
  return ast.map(node => {
    switch (node.type) {
      case 'expression':
        return operators[node.name](...evaluate(node.nodes));
      case 'string':
      case 'number':
      case 'identifier':
      default:
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
    // Implement units and integer/float typing
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
