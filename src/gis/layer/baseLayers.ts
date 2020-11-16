/** @format */

import countryLayer from '../config/countryLayer';
import { registerToken } from '.';

/**
 * 加厦门地图
 *
 * @format
 * @param layerList
 */

const handleXMConfig = (layerList: Array<any>, token?: string) => {
  if (!layerList || layerList.length == 0) {
    return [];
  }
  return layerList.map((x) => {
    registerToken(x, token);
    return {
      id: x.id,
      url: x.url,
      copyright: x.layerName,
      visible: x.visible == undefined ? true : x.visible,
      type: x.type,
      group: x.group || 'xm',
    };
  });
};

/**
 * 加载国家地图
 * @param layer
 */
const handleCountryLayer = (config, spatialReference) => {
  if (!config) {
    return [];
  }

  return countryLayer.map((x) => {
    const layer = { ...x, group: '' };
    layer.tileInfo.spatialReference = spatialReference;
    layer.spatialReference = spatialReference;
    layer.visible = config.indexOf(layer.mapType) > -1;
    layer.group = 'country';
    return layer;
  });
};

export const initBaseLayers = ({ spatialReference, country, layerList, token }) => {
  const countryLayerList = handleCountryLayer(country, spatialReference);
  const xmLayerList = handleXMConfig(layerList, token);
  return [...countryLayerList, ...xmLayerList];
};
