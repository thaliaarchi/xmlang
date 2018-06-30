const tests = [
  { func: 'add', args: [], expected: 0 },
  { func: 'add', args: [1], expected: 1 },
  { func: 'add', args: [1, 2, 3, 4], expected: 10 },

  { func: 'sub', args: [10, 1, 2, 3, 4], expected: 0 },
  { func: 'sub', args: [10], expected: -10 },
  { func: 'sub', args: [], expected: 0 },

  { func: 'mul', args: [], expected: 1 },
  { func: 'mul', args: [1], expected: 1 },
  { func: 'mul', args: [1, 2, 3, 4], expected: 24 },

  { func: 'div', args: [6, 2], expected: 3 },
  { func: 'div', args: [5, 2], expected: 2 },
  { func: 'div', args: [5.0, 2], expected: 2.5 },
  { func: 'div', args: [5, 2.0], expected: 2.5 },
  { func: 'div', args: [5.0, 2.0], expected: 2.5 },
  { func: 'div', args: [4.0], expected: 0.25 },
  { func: 'div', args: [4], expected: 0 },
  { func: 'div', args: [25, 3, 2], expected: 4 },
  { func: 'div', args: [-17, 6], expected: -2 },

  { func: 'rem', args: [9, 4], expected: 1 },
  { func: 'rem', args: [-9, 4], expected: -1 },
  { func: 'rem', args: [9, -4], expected: 1 },
  { func: 'rem', args: [-9, -4], expected: -1 },

  { func: 'mod', args: [9, 4], expected: 1 },
  { func: 'mod', args: [-9, 4], expected: 3 },
  { func: 'mod', args: [9, -4], expected: -3 },
  { func: 'mod', args: [-9, -4], expected: -1 },
  { func: 'mod', args: [5.5, 2.5], expected: .5 }
];

export default tests;
