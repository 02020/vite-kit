/** @format */

const LAYER_PROPERTIES = ['minScale', 'maxScale', 'opacity', 'visible'];
// OperationalLayer
interface EmitEntity {
  // 需要分发的图层ID
  ids: string | Array<string>;
  // 需要分发的图层组
  group: string;
  // 不用分发的图层ID (结合group使用)
  exclude: Array<string>;
  reorder: number;
  params: any;
}

export const update = (
  view: __esri.MapView,
  emitEntityList: Array<EmitEntity> | EmitEntity,
) => {
  const list = Array.isArray(emitEntityList)
    ? emitEntityList
    : [emitEntityList];
  list
    .sort((x,y) => x.reorder- y.reorder)
    .forEach((x) => {
      const ids = filterIds(x, view.map.allLayers.toArray());
      updateLayerProperties(view, ids, x);
    });
};

// 同时操做多个图层

/**
 *
 * visible 控制图层显隐
 * scale 修改比例尺
 * opacity 修改图层透明度
 */
const updateLayerProperties = (
  view: __esri.MapView,
  ids: Array<string>,
  params: any
) => {
  ids.forEach((id) => {
    const layer = view.map.findLayerById(id);
    if (!!layer) {
      if ('reorder' in params) {
        let priority = layer['priority'] || 0,
          reorder = params['reorder'];
        reorder =
          view.map.layers.filter((x) => x['priority'] <= priority).length +
          reorder;
        // console.log('reorder', reorder);
        view.map.layers.reorder(layer, reorder);
      }

      LAYER_PROPERTIES.forEach((x) => {
        params[x] != undefined && (layer[x] = params[x]);
      });
    }
  });
};

/**
 * 提取需要处理的图层ids
 * @param emitEntity
 * @param layerList
 * @return 返回需要处理的ids
 */
const filterIds = (emitEntity: EmitEntity, layerList:Array<any>): Array<string> => {
  let { ids, group, exclude } = emitEntity;
  ids = ids || [];
  let __ids = Array.isArray(ids) ? ids : [...ids.split(',')];

  if (!!group) {
    const f = (x) => {
      return (
        group.indexOf(x.group) > -1 &&
        (!exclude ? true : exclude.indexOf(x.id) < 0)
      );
    };

    __ids = layerList.filter(f).map((x) => x.id);
  }
  return __ids;
};
 