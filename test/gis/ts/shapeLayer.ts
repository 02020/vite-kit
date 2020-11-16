/** @format */

let rings = [
  [
    [118.1354454882645, 24.66703265536293],
    [118.14659098675793, 24.66703265536293],
    [118.14659098675793, 24.65725891053022],
    [118.1354454882645, 24.65725891053022],
    [118.1354454882645, 24.66703265536293],
  ],
];
// 面
export const __polygon = (gis, layer) => {
  Array.from([
    'none',
    'solid',
    'backward-diagonal',
    'cross-cross',
    'diagonal-cross',
    'forward-diagonal',
    'horizontal',
    'vertical',
  ]).forEach((item) => {
    let attrs = {
      title: +new Date(),
      key1: 'value2',
    };


    let g = layer.add({ rings }, attrs);

    g.symbol = gis.createSymbol(2, item, '#f00', '#cfc');

    rings[0].forEach((x) => {
      x[0] += 0.016;
    });
  });
};
