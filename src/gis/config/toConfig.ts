/**
 *
 * @param list
 * @param layerType 指定显示的图层类型
 */
const toLayers = (list: Array<any>, layerType: String, group?: String) => {
  return list
    .sort((a, b) => {
      return a.isTagLayer - b.isTagLayer;
    })
    .map((l, index) => {
      const layer = { ...l };
      const __type = layer.layerType || layer.type;
      const name = layer.layerName || layer.name;
      const type = __type + (layer.isTagLayer === '0' ? '' : '-TAG');
      layer.url = layer.url.trim();
      layer.id = type + '-' + name + '-' + index;
      // 图层切换使用
      layer.toggleType = type;
      layer.group = group || 'xm';
      layer.visible = __type === layerType;
      return layer;
    });
};

// 数据处理=>动态服务
/**
 * 
 * @param list 
  [{
      name: '控制点',
      type: 'LC',
      items: [{
        name: 'GPS B级(94)',
        url:
          'http://222.76.242.138/arcgis/rest/services/Metadata/KZD/MapServer',
        layerDefinitions: [{ whereClause: "idClass ='GPS B级'", layerId: '0' }],
        }
      ]
    }
  ]
 */
const toMapImageLayers = (list: Array<any>) => {
  let resp = [];
  list.forEach((group: any, i: Number) => {
    group.items.forEach((item: any, ii: Number) => {
      resp.push({
        id: group.type + '_' + item.name,
        group: group.type,
        url:  item.url || item.mapUrl,
        type: 'map-image',
        visible: false,
        sublayers: item.layerDefinitions.map((sub) => {
          return {
            visible: true,
            id: sub.layerId,
            definitionExpression: sub.whereClause,
          };
        }),
      });
    });
  });

  return resp;
};

export { toLayers, toMapImageLayers };
