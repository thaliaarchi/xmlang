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

module.exports = operators;
