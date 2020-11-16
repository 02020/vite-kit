/** @format */

// 面
const rings = [
  [
    [118.141, 24.45],
    [118.141, 24.451],
    [118.142, 24.451],
    [118.142, 24.452],
    [118.143, 24.452],
    [118.143, 24.451],
    [118.142, 24.45],
    [118.141, 24.45],
  ],
];

// 根据枚举创建 面
const createPolygon = (gis) => {
  const Style = Index.PolygonStyle;

  Object.keys(Style).forEach((x) => {
    let item = Style[x];

    gis
      .shape('shape')
      .withPoint({ rings })
      .withSymbol(2, item, '#2e4e7e', '#c93756')
      .build();

    rings[0].forEach((x) => {
      x[0] += 0.006;
    });
  });
};

// 根据枚举创建 面
const createLayerPolygon = (gis, layer) => {
  const Style = Index.PolygonStyle;

  Object.keys(Style).forEach((x) => {
    let item = Style[x];

    let attrs = {
      title: +new Date(),
      key1: 'value2',
    };

    let g = layer.add({ rings }, attrs);

    g.symbol = gis.createSymbol(2, item, '#f00', '#cfc');

    rings[0].forEach((x) => {
      x[0] += 0.003;
    });
  });
};

export { createPolygon, createLayerPolygon };
