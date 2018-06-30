import { xml2js } from 'xml-js';
import { readFileSync } from 'fs';
import operators from './operators';
import tests from './tests';

const keywords = {
  true: true,
  false: false,
  undef: undefined,
  null: null,
  Inf: Infinity,
  NaN: NaN
};

const ast = parseAST(parseXML(readFile('example/pi.xml')));
console.log(JSON.stringify(ast, null, 2));
console.log(evaluate(ast).pop());

const testResults = tests.map(test => {
  const ast = [{
    type: 'expression',
    name: test.func,
    nodes: test.args.map(arg => ({
      type: 'number',
      value: arg
    }))
  }];
  const actual = evaluate(ast)[0];
  return { ...test, actual };
}).filter(test => test.expected !== test.actual);
console.log(JSON.stringify(testResults, null, 2));

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
  return readFileSync(file, 'utf8');
}

function parseXML(xml) {
  return xml2js(xml, {
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
