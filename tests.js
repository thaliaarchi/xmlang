const int = number => ({ type: 'integer', value: number });
const float = number => ({ type: 'float', value: number });
const ints = (...numbers) => numbers.map(int);
const floats = (...numbers) => numbers.map(float);

module.exports = [
  { func: 'add', args: [], out: 0 },
  { func: 'add', args: ints(1), out: 1 },
  { func: 'add', args: ints(1, 2, 3, 4), out: 10 },

  { func: 'sub', args: ints(10, 1, 2, 3, 4), out: 0 },
  { func: 'sub', args: ints(10), out: -10 },
  { func: 'sub', args: [], out: 0 },

  { func: 'mul', args: [], out: 1 },
  { func: 'mul', args: ints(1), out: 1 },
  { func: 'mul', args: ints(1, 2, 3, 4), out: 24 },

  { func: 'div', args: ints(6, 2), out: 3 },
  { func: 'div', args: ints(5, 2), out: 2 },
  { func: 'div', args: [float(5.0), int(2)], out: 2.5 },
  { func: 'div', args: [int(5), float(2.0)], out: 2.5 },
  { func: 'div', args: floats(5.0, 2.0), out: 2.5 },
  { func: 'div', args: floats(4.0), out: 0.25 },
  { func: 'div', args: ints(4), out: 0 },
  { func: 'div', args: ints(25, 3, 2), out: 4 },
  { func: 'div', args: ints(-17, 6), out: -2 },

  { func: 'rem', args: ints(9, 4), out: 1 },
  { func: 'rem', args: ints(-9, 4), out: -1 },
  { func: 'rem', args: ints(9, -4), out: 1 },
  { func: 'rem', args: ints(-9, -4), out: -1 },

  { func: 'mod', args: ints(9, 4), out: 1 },
  { func: 'mod', args: ints(-9, 4), out: 3 },
  { func: 'mod', args: ints(9, -4), out: -3 },
  { func: 'mod', args: ints(-9, -4), out: -1 },
  { func: 'mod', args: floats(5.5, 2.5), out: .5 }
].map(test => ({ ast: [{ type: 'expression', name: test.func, nodes: test.args }], out: test.out }));
