/** @format */
import { isString, isObject } from 'lodash-es';

// 根据新的点平移矩形框
export const panExtentFromPoint = (pt, extent) => {
  const { xmax, xmin, ymax, ymin } = extent;

  const w = (xmax - xmin) / 2;
  const h = (ymax - ymin) / 2;

  return [
    [pt.x - w, pt.y - h],
    [pt.x - w, pt.y + h],
    [pt.x + w, pt.y + h],
    [pt.x + w, pt.y - h],
    [pt.x - w, pt.y - h],
  ];
}; 
// To + 对象
// 只能是一个点  string | Array<number | string>
export const formatToPoint = (pt: any) => {
  if (isObject(pt) && 'x' in pt && 'y' in pt) {
    return pt;
  }

  let pts = isString(pt) ? pt.split(',') : pt;

  pts = pts.map((x) => parseFloat(x));

  if (pts.length == 4) {
    const [xmin, ymin, xmax, ymax] = pts as number[];
    return { xmin, ymin, xmax, ymax };
  } else if (pts.length == 2) {
    const [x, y] = pts as number[];
    return { x, y };
  }
};
