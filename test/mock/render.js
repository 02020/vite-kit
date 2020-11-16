/** @format */
 
const geo = {
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
  attributes: {
    OBJECTID: 1,
    ELEMID: '350200Z0000000000000265',
    CLASID: 670500,
    NAME: '福建省厦门市湖里区湖里街道办塘边社区居委会',
    BSM: 2,
    YSDM: '1000600100',
    QHDM: '350206001006',
    QHMC: '塘边社区居委会',
    KZMJ: '429844.69000000',
    JSMJ: '429844.69000000',
  },
};

let list = [];
for (let i = 0; i < 5; i++) {
  let g = JSON.parse(JSON.stringify(geo));

  g.geometry.rings[0].forEach((x) => {
    x[0] += 0.003 * i;
  });
  g.attributes['OBJECTID'] = i;
  if (i > 3) {
    g.attributes['BSM'] = i;
  }
  list.push(g);
}


export default geo;
