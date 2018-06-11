import { fromFile } from "jsx-transform";

const compiled = fromFile('pi.xml', {
  factory: 'XMLang.evaluate',
  passUnknownTagsToFactory: true,
  unknownTagsAsString: true
});

namespace XMLang {
  const reduce = func => args => args.reduce(func);
  const map =    func => args => args.map(func);
  const every =  func => args => args.every(func);

  const operators = {
    add: reduce((a, b) => a + b),
    sub: reduce((a, b) => a - b),
    mul: reduce((a, b) => a * b),
    div: reduce((a, b) => a / b),
    mod: reduce((a, b) => a % b),
    exp: reduce((a, b) => a ** b),
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

  export function evaluate(op: string, props: { [key: string]: any }, children: any[]) {
    return operators[op](children);
  }
}

console.log(compiled);
console.log(eval(compiled));
