/** @format */
// 点
const point = { x: 118.141, y: 24.45 };

// 线
const paths = [
  [
    [118.141, 24.453],
    [118.141, 24.454],
    [118.142, 24.454],
    [118.142, 24.455],
  ],
];

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

const short = {
  // 面
  polygon: { rings: rings },
  // 线
  polyline: { paths: rings },
  // 点
  point: { x: 118.184, y: 24.676 },
};

// 后端数据
const geo = {
  layerId: 0,
  layerName: '城镇地籍宗地',
  displayFieldName: 'OBJECTID',
  value: '2659',
  attributes: {
    OBJECTID: '2659',
    SHAPE: '面',
    标识码: '23664',
    Shape_Length: '2560.628176',
    SHAPE_Area: '335758.27634',
  },
  geometryType: 'esriGeometryPolygon',
  geometry: {
    rings: [
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
    ],
  },
};

export { rings, paths, point, short, geo };
