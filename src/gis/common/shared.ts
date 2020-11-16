import { modules } from "../core";

let symbolType;
export const isSymbolType = (target): boolean => {
  if (!target) {
    return false;
  }
  let source = symbolType || new modules.Symbol();
  return source.constructor.toString() == target.constructor.toString();
};

let graphicType;
export const isGraphicType = (target): boolean => {
  if (!target) {
    return false;
  }
  let source = graphicType || new modules.Graphic();
  return source.constructor.toString() == target.constructor.toString();
};