var __assign = Object.assign;
var DEFAULT_VERSION = "4.16";
var NEXT = "next";
function parseVersion(version) {
  if (version.toLowerCase() === NEXT) {
    return NEXT;
  }
  var match = version && version.match(/^(\d)\.(\d+)/);
  return match && {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10)
  };
}
function getCdnUrl(version) {
  if (version === void 0) {
    version = DEFAULT_VERSION;
  }
  return "https://js.arcgis.com/" + version + "/";
}
function getCdnCssUrl(version) {
  if (version === void 0) {
    version = DEFAULT_VERSION;
  }
  var baseUrl = getCdnUrl(version);
  var parsedVersion = parseVersion(version);
  if (parsedVersion !== NEXT && parsedVersion.major === 3) {
    var path = parsedVersion.minor <= 10 ? "js/" : "";
    return "" + baseUrl + path + "esri/css/esri.css";
  } else {
    return baseUrl + "esri/themes/light/main.css";
  }
}
function createStylesheetLink(href) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  return link;
}
function insertLink(link, before) {
  if (before) {
    var beforeNode = document.querySelector(before);
    beforeNode.parentNode.insertBefore(link, beforeNode);
  } else {
    document.head.appendChild(link);
  }
}
function getCss(url) {
  return document.querySelector('link[href*="' + url + '"]');
}
function getCssUrl(urlOrVersion) {
  return !urlOrVersion || parseVersion(urlOrVersion) ? getCdnCssUrl(urlOrVersion) : urlOrVersion;
}
function loadCss(urlOrVersion, before) {
  var url = getCssUrl(urlOrVersion);
  var link = getCss(url);
  if (!link) {
    link = createStylesheetLink(url);
    insertLink(link, before);
  }
  return link;
}
var isBrowser = typeof window !== "undefined";
var utils = {
  Promise: isBrowser ? window["Promise"] : void 0
};
var defaultOptions = {};
function createScript(url) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.setAttribute("data-esri-loader", "loading");
  return script;
}
function handleScriptLoad(script, callback, errback) {
  var onScriptError;
  if (errback) {
    onScriptError = handleScriptError(script, errback);
  }
  var onScriptLoad = function() {
    callback(script);
    script.removeEventListener("load", onScriptLoad, false);
    if (onScriptError) {
      script.removeEventListener("error", onScriptError, false);
    }
  };
  script.addEventListener("load", onScriptLoad, false);
}
function handleScriptError(script, callback) {
  var onScriptError = function(e) {
    callback(e.error || new Error("There was an error attempting to load " + script.src));
    script.removeEventListener("error", onScriptError, false);
  };
  script.addEventListener("error", onScriptError, false);
  return onScriptError;
}
function getScript() {
  return document.querySelector("script[data-esri-loader]");
}
function isLoaded() {
  var globalRequire = window["require"];
  return globalRequire && globalRequire.on;
}
function loadScript(options) {
  if (options === void 0) {
    options = {};
  }
  var opts = {};
  [defaultOptions, options].forEach(function(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        opts[prop] = obj[prop];
      }
    }
  });
  var version = opts.version;
  var url = opts.url || getCdnUrl(version);
  return new utils.Promise(function(resolve, reject) {
    var script = getScript();
    if (script) {
      var src = script.getAttribute("src");
      if (src !== url) {
        reject(new Error("The ArcGIS API for JavaScript is already loaded (" + src + ")."));
      } else {
        if (isLoaded()) {
          resolve(script);
        } else {
          handleScriptLoad(script, resolve, reject);
        }
      }
    } else {
      if (isLoaded()) {
        reject(new Error("The ArcGIS API for JavaScript is already loaded."));
      } else {
        var css = opts.css;
        if (css) {
          var useVersion = css === true;
          loadCss(useVersion ? version : css, opts.insertCssBefore);
        }
        if (opts.dojoConfig) {
          window["dojoConfig"] = opts.dojoConfig;
        }
        script = createScript(url);
        handleScriptLoad(script, function() {
          script.setAttribute("data-esri-loader", "loaded");
          resolve(script);
        }, reject);
        document.body.appendChild(script);
      }
    }
  });
}
function requireModules(modules2) {
  return new utils.Promise(function(resolve, reject) {
    var errorHandler = window["require"].on("error", reject);
    window["require"](modules2, function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      errorHandler.remove();
      resolve(args);
    });
  });
}
function loadModules(modules2, loadScriptOptions) {
  if (loadScriptOptions === void 0) {
    loadScriptOptions = {};
  }
  if (!isLoaded()) {
    var script = getScript();
    var src = script && script.getAttribute("src");
    if (!loadScriptOptions.url && src) {
      loadScriptOptions.url = src;
    }
    return loadScript(loadScriptOptions).then(function() {
      return requireModules(modules2);
    });
  } else {
    return requireModules(modules2);
  }
}
function mitt(all) {
  all = all || new Map();
  let onlyMap = new Map();
  const toggle = function(target, type, fn, flag) {
    const handlers = target.get(type);
    if (handlers && handlers.length) {
      handlers.forEach((handler) => {
        flag = flag || !handler.active;
        if (fn == handler) {
          handler.active = !flag;
        } else {
          handler.active = flag;
        }
      });
    }
  };
  return {
    all,
    on(type, handler) {
      handler.active = true;
      const handlers = all.get(type);
      if (handlers) {
        if (handlers.indexOf(handler) < 0) {
          handlers.push(handler);
        }
      } else {
        all.set(type, [handler]);
      }
    },
    only(type, handler) {
      handler.active = true;
      const handlers = onlyMap.get(type);
      if (handlers) {
        if (handlers.indexOf(handler) < 0) {
          handlers.unshift(handler);
        } else {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
          handlers.unshift(handler);
        }
      } else {
        onlyMap.set(type, [handler]);
      }
    },
    off(type, handler) {
      let handlers = onlyMap.get(type);
      if (!handlers) {
        handlers = all.get(type);
      }
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },
    emit(type, evt) {
      const handlers = onlyMap.get(type);
      if (handlers && handlers.length) {
        handlers[0].active && handlers[0](evt);
      } else {
        (all.get(type) || []).slice().map((handler) => {
          handler.active && handler(evt);
        });
      }
      (all.get("*") || []).slice().map((handler) => {
        handler(type, evt);
      });
    },
    toggle(type, fn, flag) {
      toggle(all, type, fn, flag);
      toggle(onlyMap, type, fn, flag);
    }
  };
}
var WidgetsIndex;
(function(WidgetsIndex2) {
  WidgetsIndex2["Zoom"] = "Zoom";
  WidgetsIndex2["Locate"] = "Locate";
  WidgetsIndex2["NavigationToggle"] = "NavigationToggle";
  WidgetsIndex2["Compass"] = "Compass";
  WidgetsIndex2["Measurement"] = "Measurement";
  WidgetsIndex2["Swipe"] = "Swipe";
  WidgetsIndex2["TimeSlider"] = "TimeSlider";
  WidgetsIndex2["ScaleBar"] = "ScaleBar";
})(WidgetsIndex || (WidgetsIndex = {}));
var ShapeTypeIndex;
(function(ShapeTypeIndex2) {
  ShapeTypeIndex2["Point"] = "point";
  ShapeTypeIndex2["Polyline"] = "polyline";
  ShapeTypeIndex2["Polygon"] = "polygon";
})(ShapeTypeIndex || (ShapeTypeIndex = {}));
var SketchTypeIndex;
(function(SketchTypeIndex2) {
  SketchTypeIndex2["Point"] = "point";
  SketchTypeIndex2["Multipoint"] = "multipoint";
  SketchTypeIndex2["Polyline"] = "polyline";
  SketchTypeIndex2["Polygon"] = "polygon";
  SketchTypeIndex2["Circle"] = "circle";
  SketchTypeIndex2["Rectangle"] = "rectangle";
  SketchTypeIndex2["Text"] = "text";
})(SketchTypeIndex || (SketchTypeIndex = {}));
var ActiveToolIndex;
(function(ActiveToolIndex2) {
  ActiveToolIndex2["Move"] = "move";
  ActiveToolIndex2["Transform"] = "transform";
  ActiveToolIndex2["Reshape"] = "reshape";
})(ActiveToolIndex || (ActiveToolIndex = {}));
var ShapeLayerIndex;
(function(ShapeLayerIndex2) {
})(ShapeLayerIndex || (ShapeLayerIndex = {}));
var PolygonStyle;
(function(PolygonStyle2) {
  PolygonStyle2["NONE"] = "none";
  PolygonStyle2["SOLID"] = "solid";
  PolygonStyle2["BACKWARD_DIAGONAL"] = "backward-diagonal";
  PolygonStyle2["CROSS_CROSS"] = "cross-cross";
  PolygonStyle2["DIAGONAL_CROSS"] = "diagonal-cross";
  PolygonStyle2["FORWARD_DIAGONAL"] = "forward-diagonal";
  PolygonStyle2["HORIZONTAL"] = "horizontal";
  PolygonStyle2["VERTICAL"] = "vertical";
})(PolygonStyle || (PolygonStyle = {}));
var PolylineStyle;
(function(PolylineStyle2) {
  PolylineStyle2["DASH"] = "dash";
  PolylineStyle2["DASH_DOT"] = "dash-dot";
  PolylineStyle2["DOT"] = "dot";
  PolylineStyle2["LONG_DASH"] = "long-dash";
  PolylineStyle2["LONG_DASH_DOT"] = "long-dash-dot";
  PolylineStyle2["LONG_DASH_DOT_DOT"] = "long-dash-dot-dot";
  PolylineStyle2["NONE"] = "none";
  PolylineStyle2["SHORT_DASH"] = "short-dash";
  PolylineStyle2["SHORT_DASH_DOT"] = "short-dash-dot";
  PolylineStyle2["SHORT_DASH_DOT_DOT"] = "short-dash-dot-dot";
  PolylineStyle2["SHORT_DOT"] = "short-dot";
  PolylineStyle2["SOLID"] = "solid";
})(PolylineStyle || (PolylineStyle = {}));
var PointStyle;
(function(PointStyle2) {
  PointStyle2["CIRCLE"] = "circle";
  PointStyle2["CROSS"] = "cross-cross";
  PointStyle2["DIAMOND"] = "diamond";
  PointStyle2["SQUARE"] = "square";
  PointStyle2["TRIANGLE"] = "triangle";
  PointStyle2["X"] = "x";
})(PointStyle || (PointStyle = {}));
const Index = {
  ShapeTypeIndex,
  SketchTypeIndex,
  ActiveToolIndex,
  WidgetsIndex,
  PolygonStyle,
  PolylineStyle,
  PointStyle
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
const cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var Symbol = root.Symbol;
var objectProto = Object.prototype;
var hasOwnProperty$1 = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var objectProto$1 = Object.prototype;
var nativeObjectToString$1 = objectProto$1.toString;
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag$1 = Symbol ? Symbol.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var isArray$1 = Array.isArray;
var INFINITY = 1 / 0;
var symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray$1(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$1(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, "");
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var INFINITY$1 = 1 / 0, MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$1 || value === -INFINITY$1) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
function toInteger(value) {
  var result = toFinite(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
function identity(value) {
  return value;
}
var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$1(value) {
  if (!isObject$1(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype, objectProto$2 = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var WeakMap = getNative(root, "WeakMap");
var metaMap = WeakMap && new WeakMap();
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject$1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
function createCtor(Ctor) {
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0:
        return new Ctor();
      case 1:
        return new Ctor(args[0]);
      case 2:
        return new Ctor(args[0], args[1]);
      case 3:
        return new Ctor(args[0], args[1], args[2]);
      case 4:
        return new Ctor(args[0], args[1], args[2], args[3]);
      case 5:
        return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
    return isObject$1(result) ? result : thisBinding;
  };
}
var WRAP_BIND_FLAG = 1;
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
  function wrapper() {
    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var nativeMax = Math.max;
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}
var nativeMax$1 = Math.max;
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax$1(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}
function countHolders(array, placeholder) {
  var length = array.length, result = 0;
  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}
function baseLodash() {
}
var MAX_ARRAY_LENGTH = 4294967295;
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
function noop() {
}
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};
var realNames = {};
var objectProto$3 = Object.prototype;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
function getFuncName(func) {
  var result = func.name + "", array = realNames[result], length = hasOwnProperty$3.call(realNames, result) ? array.length : 0;
  while (length--) {
    var data = array[length], otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = void 0;
}
LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__ = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}
var objectProto$4 = Object.prototype;
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
function lodash(value) {
  if (isObjectLike(value) && !isArray$1(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty$4.call(value, "__wrapped__")) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
function isLaziable(func) {
  var funcName = getFuncName(func), other = lodash[funcName];
  if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var setData = shortOut(baseSetData);
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
  details = details.join(length > 2 ? ", " : " ");
  return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
}
function constant(value) {
  return function() {
    return value;
  };
}
var defineProperty = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, "toString", {
    configurable: true,
    enumerable: false,
    value: constant(string),
    writable: true
  });
};
var setToString = shortOut(baseSetToString);
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
function baseIsNaN(value) {
  return value !== value;
}
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
var WRAP_BIND_FLAG$1 = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
var wrapFlags = [
  ["ary", WRAP_ARY_FLAG],
  ["bind", WRAP_BIND_FLAG$1],
  ["bindKey", WRAP_BIND_KEY_FLAG],
  ["curry", WRAP_CURRY_FLAG],
  ["curryRight", WRAP_CURRY_RIGHT_FLAG],
  ["flip", WRAP_FLIP_FLAG],
  ["partial", WRAP_PARTIAL_FLAG],
  ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
  ["rearg", WRAP_REARG_FLAG]
];
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function(pair) {
    var value = "_." + pair[0];
    if (bitmask & pair[1] && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}
function setWrapToString(wrapper, reference, bitmask) {
  var source = reference + "";
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}
var WRAP_BIND_FLAG$2 = 1, WRAP_BIND_KEY_FLAG$1 = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG$1 = 8, WRAP_PARTIAL_FLAG$1 = 32, WRAP_PARTIAL_RIGHT_FLAG$1 = 64;
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG$1, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
  bitmask |= isCurry ? WRAP_PARTIAL_FLAG$1 : WRAP_PARTIAL_RIGHT_FLAG$1;
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$1);
  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG$2 | WRAP_BIND_KEY_FLAG$1);
  }
  var newData = [
    func,
    bitmask,
    thisArg,
    newPartials,
    newHolders,
    newPartialsRight,
    newHoldersRight,
    argPos,
    ary,
    arity
  ];
  var result = wrapFunc.apply(void 0, newData);
  if (isLaziable(func)) {
    setData(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}
function getHolder(func) {
  var object = func;
  return object.placeholder;
}
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var nativeMin = Math.min;
function reorder(array, indexes) {
  var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
  }
  return array;
}
var PLACEHOLDER = "__lodash_placeholder__";
function replaceHolders(array, placeholder) {
  var index = -1, length = array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}
var WRAP_BIND_FLAG$3 = 1, WRAP_BIND_KEY_FLAG$2 = 2, WRAP_CURRY_FLAG$2 = 8, WRAP_CURRY_RIGHT_FLAG$1 = 16, WRAP_ARY_FLAG$1 = 128, WRAP_FLIP_FLAG$1 = 512;
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG$1, isBind = bitmask & WRAP_BIND_FLAG$3, isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2, isCurried = bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1), isFlip = bitmask & WRAP_FLIP_FLAG$1, Ctor = isBindKey ? void 0 : createCtor(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index = length;
    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
    }
    var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
    while (index--) {
      args[index] = arguments[index];
    }
    var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
    length -= holders.length;
    if (length < arity) {
      return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, void 0, args, holders, void 0, void 0, arity - length);
    }
    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}
var WRAP_BIND_FLAG$4 = 1;
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG$4, Ctor = createCtor(func);
  function wrapper() {
    var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}
var PLACEHOLDER$1 = "__lodash_placeholder__";
var WRAP_BIND_FLAG$5 = 1, WRAP_BIND_KEY_FLAG$3 = 2, WRAP_CURRY_BOUND_FLAG$1 = 4, WRAP_CURRY_FLAG$3 = 8, WRAP_ARY_FLAG$2 = 128, WRAP_REARG_FLAG$1 = 256;
var nativeMin$1 = Math.min;
function mergeData(data, source) {
  var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG$5 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);
  var isCombo = srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_CURRY_FLAG$3 || srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_REARG_FLAG$1 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$1) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG$3;
  if (!(isCommon || isCombo)) {
    return data;
  }
  if (srcBitmask & WRAP_BIND_FLAG$5) {
    data[2] = source[2];
    newBitmask |= bitmask & WRAP_BIND_FLAG$5 ? 0 : WRAP_CURRY_BOUND_FLAG$1;
  }
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER$1) : source[4];
  }
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER$1) : source[6];
  }
  value = source[7];
  if (value) {
    data[7] = value;
  }
  if (srcBitmask & WRAP_ARY_FLAG$2) {
    data[8] = data[8] == null ? source[8] : nativeMin$1(data[8], source[8]);
  }
  if (data[9] == null) {
    data[9] = source[9];
  }
  data[0] = source[0];
  data[1] = newBitmask;
  return data;
}
var FUNC_ERROR_TEXT = "Expected a function";
var WRAP_BIND_FLAG$6 = 1, WRAP_BIND_KEY_FLAG$4 = 2, WRAP_CURRY_FLAG$4 = 8, WRAP_CURRY_RIGHT_FLAG$2 = 16, WRAP_PARTIAL_FLAG$2 = 32, WRAP_PARTIAL_RIGHT_FLAG$2 = 64;
var nativeMax$2 = Math.max;
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4;
  if (!isBindKey && typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG$2 | WRAP_PARTIAL_RIGHT_FLAG$2);
    partials = holders = void 0;
  }
  ary = ary === void 0 ? ary : nativeMax$2(toInteger(ary), 0);
  arity = arity === void 0 ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;
  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$2) {
    var partialsRight = partials, holdersRight = holders;
    partials = holders = void 0;
  }
  var data = isBindKey ? void 0 : getData(func);
  var newData = [
    func,
    bitmask,
    thisArg,
    partials,
    holders,
    partialsRight,
    holdersRight,
    argPos,
    ary,
    arity
  ];
  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax$2(newData[9] - length, 0);
  if (!arity && bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2)) {
    bitmask &= ~(WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG$6) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG$4 || bitmask == WRAP_CURRY_RIGHT_FLAG$2) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG$2 || bitmask == (WRAP_BIND_FLAG$6 | WRAP_PARTIAL_FLAG$2)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(void 0, newData);
  }
  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty) {
    defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true
    });
  } else {
    object[key] = value;
  }
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var nativeMax$3 = Math.max;
function overRest(func, start, transform) {
  start = nativeMax$3(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax$3(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
var MAX_SAFE_INTEGER$1 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}
var objectProto$5 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$5;
  return value === proto;
}
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}
var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;
var isArguments = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$5.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
function stubFalse() {
  return false;
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : void 0;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var argsTag$1 = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag$1 = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal.process;
var nodeUtil = function() {
  try {
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var nativeKeys = overArg(Object.keys, Object);
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var nativeCreate = getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto$9 = Object.prototype;
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty$8.call(data, key) ? data[key] : void 0;
}
var objectProto$a = Object.prototype;
var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty$9.call(data, key);
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    hash: new Hash(),
    map: new (Map$1 || ListCache)(),
    string: new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var FUNC_ERROR_TEXT$1 = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function castPath(value, object) {
  if (isArray$1(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}
var INFINITY$2 = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
}
function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : void 0;
}
function arrayPush(array, values2) {
  var index = -1, length = values2.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values2[index];
  }
  return array;
}
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return isArray$1(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}
function flatRest(func) {
  return setToString(overRest(func, void 0, flatten), func + "");
}
var WRAP_BIND_FLAG$7 = 1, WRAP_PARTIAL_FLAG$3 = 32;
var bind = baseRest(function(func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG$7;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG$3;
  }
  return createWrap(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
var bindAll = flatRest(function(object, methodNames) {
  arrayEach(methodNames, function(key) {
    key = toKey(key);
    baseAssignValue(object, key, bind(object[key], object));
  });
  return object;
});
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray$1(object) || isArguments(object));
}
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
var now = function() {
  return root.Date.now();
};
var FUNC_ERROR_TEXT$2 = "Expected a function";
var nativeMax$4 = Math.max, nativeMin$2 = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax$4(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin$2(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function defaultTo(value, defaultValue) {
  return value == null || value !== value ? defaultValue : value;
}
function fromPairs(pairs) {
  var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}
var stringTag$1 = "[object String]";
function isString$1(value) {
  return typeof value == "string" || !isArray$1(value) && isObjectLike(value) && baseGetTag(value) == stringTag$1;
}
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}
var boolTag$1 = "[object Boolean]";
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag$1;
}
function isInteger(value) {
  return typeof value == "number" && value == toInteger(value);
}
var numberTag$1 = "[object Number]";
function isNumber(value) {
  return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag$1;
}
function isNil(value) {
  return value == null;
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return value === void 0;
}
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}
const functionApply = (...args) => {
  const param = args.shift();
  for (let index = 0; index < args.length; index++) {
    if (index + 1 == param.length && isFunction(args[index])) {
      return args[index].apply(null, param);
    }
  }
};
function collectionHandlers(collection, cb) {
  if (isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      cb(collection[i]);
    }
  } else if (collection instanceof Map) {
    collection.forEach((v, key) => {
      cb(collection.get(key));
    });
  } else if (collection instanceof Set) {
    collection.forEach((fn) => {
      cb(fn);
    });
  } else {
    for (const key in collection) {
      cb(collection[key]);
    }
  }
}
function invokeFns(fns, arg) {
  collectionHandlers(fns, function(fn) {
    isFunction(fn) && fn(arg);
  });
}
const includesEnum = (list, val) => {
  return values(list).includes(val);
};
const isNotEnumThrow = (list, val) => {
  if (!includesEnum(list, val)) {
    console.table(list);
    throw new Error(`类型不存在:${val}`);
  }
};
const isKeysEqual = (target, keys2) => {
  keys2 = isString(keys2) ? keys2.split(",") : keys2;
  return Object.keys(target).sort().join() === keys2.sort().join();
};
const isSymbolType = (target) => {
  if (!target) {
    return false;
  }
  let source = new modules.Symbol();
  return source.constructor.toString() == target.constructor.toString();
};
const isGraphicType = (target) => {
  if (!target) {
    return false;
  }
  let source = new modules.Graphic();
  return source.constructor.toString() == target.constructor.toString();
};
const getDPI = () => {
  var tmpNode = document.createElement("div");
  tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
  document.body.appendChild(tmpNode);
  const dpi = [tmpNode.offsetWidth, tmpNode.offsetHeight];
  tmpNode.parentNode.removeChild(tmpNode);
  return dpi;
};
var shared = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  values,
  hasOwn,
  isArray,
  isDate,
  isFunction,
  isString,
  isObject,
  camelize,
  capitalize,
  functionApply,
  invokeFns,
  collectionHandlers,
  includesEnum,
  isNotEnumThrow,
  isKeysEqual,
  isSymbolType,
  isGraphicType,
  getDPI,
  debounce,
  fromPairs,
  bindAll,
  defaultTo,
  property,
  isNil,
  isNull,
  isUndefined,
  toInteger,
  toNumber,
  isNumber,
  isInteger,
  isBoolean,
  constant,
  hasIn,
  uniqueId,
  get WidgetsIndex() {
    return WidgetsIndex;
  },
  get ShapeTypeIndex() {
    return ShapeTypeIndex;
  },
  get SketchTypeIndex() {
    return SketchTypeIndex;
  },
  get ActiveToolIndex() {
    return ActiveToolIndex;
  },
  get ShapeLayerIndex() {
    return ShapeLayerIndex;
  },
  get PolygonStyle() {
    return PolygonStyle;
  },
  get PolylineStyle() {
    return PolylineStyle;
  },
  get PointStyle() {
    return PointStyle;
  },
  Index
});
class Bus {
  constructor() {
    this.emitter = mitt();
  }
  toggle(type, fn, value) {
    if (isFunction(fn)) {
      this.emitter.toggle(type, fn, value);
    } else {
      this.emitter.toggle(type, null, fn);
    }
  }
  on(...args) {
    if (args.length == 3) {
      this.emitter.on(args[0] + "-" + args[1], args[2]);
    } else {
      this.emitter.on(args[0], args[1]);
    }
  }
  only(...args) {
    if (args.length == 3) {
      this.emitter.only(args[0] + "-" + args[1], args[2]);
    } else {
      this.emitter.only(args[0], args[1]);
    }
  }
  once(...args) {
    let type;
    let handler;
    if (args.length == 3) {
      type = args[0] + "-" + args[1];
      handler = args[2];
    } else {
      type = args[0];
      handler = args[1];
    }
    let temp = (...params) => {
      handler.apply(null, params);
      this.emitter.off(type, temp);
    };
    this.emitter.on(type, temp);
  }
  emit(message, data) {
    this.emitter.emit(message, data);
  }
  off(type, handler) {
    this.emitter.off(type, handler);
  }
}
const MAP_VIEW_EVENTS = [
  "blur",
  "click",
  "double-click",
  "drag",
  "focus",
  "hold",
  "mouse-wheel",
  "resize",
  "pointer-move",
  "pointer-down",
  "pointer-enter",
  "pointer-leave",
  "layerview-destroy",
  "layerview-create",
  "layerview-create-error"
];
const viewEvents = (content) => {
  const view = content.view;
  for (var i = 0; i < MAP_VIEW_EVENTS.length; i++) {
    const eventName = MAP_VIEW_EVENTS[i];
    view.on(eventName, (ev) => {
      if (eventName == "pointer-move") {
        ev.__point = view.toMap(ev);
      }
      if (eventName.indexOf("layerview") > -1) {
        let __name = "gis" + eventName.replace("layerview", "");
        __name += "-" + ev.layer.id || "none";
        console.log(__name, ev);
        content.emit(__name, ev.layer);
        return;
      }
      if (content.hitTest) {
        view.hitTest(ev).then((response) => {
          let resp = [], name2 = "gis-" + eventName;
          if (response.results.length > 0) {
            resp = response.results.map((x) => {
              return x.graphic;
            });
            var layerId = resp[0].layer.id || "default";
            content.emit(name2 + "-" + layerId, response);
          }
          content.emit(name2, response);
        });
      } else {
        content.emit("gis-" + eventName, ev);
      }
      if ("pointer-down" == eventName) {
        if (ev.button === 2)
          ;
        else if (ev.button === 0)
          ;
      }
    });
  }
  view.map.allLayers.on("change", (params) => {
    content.emit("gis-change", params);
  });
  view.watch("scale", (ev) => {
    const {xmax, xmin, ymax, ymin} = view.extent;
    isInteger(view.zoom) && content.emit("gis-zoom", {
      zoom: view.zoom,
      center: center(view.extent),
      xmax,
      xmin,
      ymax,
      ymin,
      extent: view.extent,
      view
    });
  });
};
const center = (extent) => {
  const {xmax, xmin, ymax, ymin} = extent;
  return {
    x: (xmax + xmin) / 2,
    y: (ymax + ymin) / 2
  };
};
var defaultModulesPath = [
  "esri/core/Collection",
  "esri/identity/IdentityManager",
  "esri/Basemap",
  "esri/geometry/Extent",
  "esri/geometry/SpatialReference",
  "esri/Ground",
  "esri/layers/TileLayer",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/support/Domain",
  "esri/layers/support/CodedValueDomain",
  "esri/widgets/FeatureForm/FieldConfig",
  "esri/widgets/FeatureForm/FeatureFormViewModel",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/Color",
  "esri/symbols/Symbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/PictureFillSymbol",
  "esri/views/draw/Draw",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/tasks/PrintTask",
  "esri/tasks/support/PrintTemplate",
  "esri/tasks/support/PrintParameters",
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/MenuSeparator",
  "esri/widgets/Popup",
  "esri/PopupTemplate",
  "esri/popup/content/TextContent",
  "esri/widgets/Zoom",
  "esri/widgets/Locate",
  "esri/widgets/NavigationToggle",
  "esri/widgets/Compass",
  "esri/widgets/Measurement",
  "esri/widgets/Swipe",
  "esri/widgets/TimeSlider",
  "esri/widgets/ScaleBar",
  "esri/widgets/Editor"
];
const getModuleName = (path) => {
  var paths = path.split("/");
  return paths[paths.length - 1];
};
const loadModulesPath = (modules2) => {
  let modulesPath = [];
  defaultModulesPath.forEach((x) => {
    const name2 = getModuleName(x);
    if (!modules2[name2]) {
      modulesPath.push(x);
    }
  });
  return modulesPath;
};
let modules = {};
async function initModules() {
  const modulesPath = loadModulesPath(modules);
  let names = modulesPath.map(getModuleName);
  const modulesArray = await loadModules(modulesPath);
  for (let i = 0; i < names.length; i++) {
    modules[names[i]] = modulesArray[i];
  }
}
async function createMap(properties) {
  await castLayers(properties);
  const [Map2] = await loadModules(["esri/Map"]);
  return new Map2(properties);
}
async function createMapView(properties) {
  const [MapView] = await loadModules(["esri/views/MapView"]);
  modules.MapView = MapView;
  const view = new MapView(properties);
  return view;
}
async function castLayers(properties) {
  if (!!properties.layers) {
    const layersProps = properties.layers;
    properties.layers = await createLayers(layersProps);
  }
  if (!!properties.basemap && typeof properties.basemap !== "string") {
    const basemapProps = properties.basemap;
    const layersProps = basemapProps.baseLayers;
    basemapProps.baseLayers = await createLayers(layersProps);
  }
  if (!!properties.ground && typeof properties.ground !== "string") {
    const groundProps = properties.ground;
    const layersProps = groundProps.layers;
    groundProps.layers = await createLayers(layersProps);
  }
}
async function createLayers(layersProps) {
  const layers = [];
  for (const layerProps of layersProps) {
    const layer = await createLayer(layerProps);
    layers.push(layer);
  }
  return layers;
}
async function createLayer(props) {
  const layerType = props.type;
  delete props.type;
  let layer;
  switch (layerType) {
    case "feature":
      const [FeatureLayer] = await loadModules(["esri/layers/FeatureLayer"]);
      layer = new FeatureLayer(props);
      break;
    case "graphics":
      const [GraphicsLayer] = await loadModules(["esri/layers/GraphicsLayer"]);
      modules.GraphicsLayer = GraphicsLayer;
      layer = new GraphicsLayer(props);
      break;
    case "tile":
      const [TileLayer] = await loadModules(["esri/layers/TileLayer"]);
      let sublayers;
      if (!!props.sublayers) {
        sublayers = props.sublayers;
        delete props.sublayers;
      }
      layer = new TileLayer(props);
      if (!!sublayers && sublayers.length) {
        await layer.load();
        const tile = layer;
        for (const sublayer of sublayers) {
          const subl = tile.sublayers.find((l) => l.id === sublayer.id);
          subl.title = sublayer.title;
          subl.legendEnabled = sublayer.legendEnabled;
          subl.popupEnabled = sublayer.popupEnabled;
          subl.popupTemplate = sublayer.popupTemplate;
        }
      }
      break;
    case "web-tile":
      const [WebTileLayer] = await loadModules(["esri/layers/WebTileLayer"]);
      layer = new WebTileLayer(props);
      break;
    case "elevation":
      const [ElevationLayer] = await loadModules([
        "esri/layers/ElevationLayer"
      ]);
      layer = new ElevationLayer(props);
      break;
    case "exaggerated-elevation":
      const [ExaggeratedElevationLayer] = await loadModules([
        "beginor/ExaggeratedElevationLayer"
      ]);
      layer = new ExaggeratedElevationLayer(props);
      break;
    case "imagery":
      const [ImageryLayer] = await loadModules(["esri/layers/ImageryLayer"]);
      layer = new ImageryLayer(props);
      break;
    case "integrated-mesh":
      const [IntegratedMeshLayer] = await loadModules([
        "esri/layers/IntegratedMeshLayer"
      ]);
      layer = new IntegratedMeshLayer(props);
      break;
    case "map-image":
      const [MapImageLayer] = await loadModules(["esri/layers/MapImageLayer"]);
      layer = new MapImageLayer(props);
      break;
    case "map-notes":
      const [MapNotesLayer] = await loadModules(["esri/layers/MapNotesLayer"]);
      layer = new MapNotesLayer(props);
      break;
    case "point-cloud":
      const [PointCloudLayer] = await loadModules([
        "esri/layers/PointCloudLayer"
      ]);
      layer = new PointCloudLayer(props);
      break;
    case "scene":
      const [SceneLayer] = await loadModules(["esri/layers/SceneLayer"]);
      layer = new SceneLayer(props);
      break;
    case "stream":
      const [StreamLayer] = await loadModules(["esri/layers/StreamLayer"]);
      layer = new StreamLayer(props);
      break;
    case "vector-tile":
      const [VectorTileLayer] = await loadModules([
        "esri/layers/VectorTileLayer"
      ]);
      layer = new VectorTileLayer(props);
      break;
    case "bing-maps":
      const [BingMapsLayer] = await loadModules(["esri/layers/BingMapsLayer"]);
      layer = new BingMapsLayer(props);
      break;
    case "csv":
      const [CSVLayer] = await loadModules(["esri/layers/CSVLayer"]);
      layer = new CSVLayer(props);
      break;
    case "georss":
      const [GeoRSSLayer] = await loadModules(["esri/layers/GeoRSSLayer"]);
      layer = new GeoRSSLayer(props);
      break;
    case "group":
      if (!!props.layers) {
        props.layers = await createLayers(props.layers);
      }
      const [GroupLayer] = await loadModules(["esri/layers/GroupLayer"]);
      layer = new GroupLayer(props);
      break;
    case "kml":
      const [KMLLayer] = await loadModules(["esri/layers/KMLLayer"]);
      layer = new KMLLayer(props);
      break;
    case "open-street-map":
      const [OpenStreetMapLayer] = await loadModules([
        "esri/layers/OpenStreetMapLayer"
      ]);
      layer = new OpenStreetMapLayer(props);
      break;
    case "wms":
      const [WMSLayer] = await loadModules(["esri/layers/WMSLayer"]);
      layer = new WMSLayer(props);
      break;
    case "wmts":
      const [WMTSLayer] = await loadModules(["esri/layers/WMTSLayer"]);
      layer = new WMTSLayer(props);
      break;
    default:
      throw new Error(`Unknown layer type: ${layerType}. props:${props}`);
  }
  return layer;
}
function randomColor() {
  return new modules.Color([
    randomNum(255),
    randomNum(255),
    randomNum(255),
    0.7
  ]);
}
function randomNum(max) {
  var num = Math.random() * max;
  return max > 1 ? Math.ceil(num) : num;
}
const createDefaultSymbol = (type) => {
  if ("polygon,rectangle,fill,area".indexOf(type) > -1) {
    return new modules.SimpleFillSymbol({
      outline: createDefaultSymbol("line"),
      color: randomColor()
    });
  }
  if (type === "line" || type === "polyline") {
    return new modules.SimpleLineSymbol({
      color: randomColor(),
      width: 4
    });
  }
  if (type === "text") {
    const text = new modules.TextSymbol({
      color: "#000",
      text: "请输入",
      xoffset: 0,
      yoffset: 0,
      font: {
        size: 20,
        family: "sans-serif"
      }
    });
    return text;
  }
};
const symbolStrategy = (name2) => {
  let point = create(8, "diamond", "palegreen", "seagreen");
  let polyline = create(1, "dash", "rgb(255, 0, 0)");
  let text = create(12, "text", "rgb(255, 0, 0)", "arcgis font title");
  let polygon = create(1, "solid", "rgb(48, 49, 51)", "rgba(102, 195, 255,0.3)");
  if (name2 === "pickup") {
    point = create(8, "diamond", "palegreen", "seagreen");
    polyline = create(1, "solid", "rgb(255, 0, 0)");
    text = create(12, "text", "rgb(102, 195, 255)", "arcgis font title");
    polygon = create(1, "diagonal-cross", "rgb(255, 0, 0)", "rgb(102, 195, 255)");
  }
  return {point, polyline, polygon, text};
};
const paramOne = (symbol) => {
  if ("default,pickup".indexOf(symbol) > -1) {
    return symbolStrategy(symbol);
  }
  if (isString(symbol)) {
    return createDefaultSymbol(symbol);
  }
  if (!isObject(symbol)) {
    return;
  }
  symbol.color && (symbol.color = new modules.Color(symbol.color));
  if (isKeysEqual(symbol, "style,color,outline")) {
    return new modules.SimpleFillSymbol(symbol);
  } else if (isKeysEqual(symbol, "style,width,color")) {
    return new modules.SimpleLineSymbol(symbol);
  } else if (isKeysEqual(symbol, "style,size,color,outline")) {
    return new modules.SimpleMarkerSymbol(symbol);
  } else if (isKeysEqual(symbol, "height,width,url")) {
    return new modules.PictureMarkerSymbol(symbol);
  } else if (isKeysEqual(symbol, "color,text,size,family,style")) {
    const {color, text, size, family, style} = symbol;
    return new modules.TextSymbol({
      color,
      text,
      xoffset: 0,
      yoffset: 0,
      horizontalAlignment: "left",
      verticalAlignment: "top",
      font: {size, family, style}
    });
  } else if (isSymbolType(symbol)) {
    return symbol;
  } else {
    console.error("非标准格式无法创建样式:" + symbol);
  }
};
const paramTwo = (...args) => {
  const [width, url] = args;
  if ([".png", ".jpg", ".svg"].indexOf(url.substr(-4)) > -1) {
    return new modules.PictureMarkerSymbol({
      url,
      width,
      height: width
    });
  }
  return new modules.SimpleLineSymbol({
    style: "solid",
    width: args[0],
    color: args[1]
  });
};
const paramThree = (...args) => {
  let [size, style, color] = args;
  if ([".png", ".jpg", ".svg"].indexOf(color.substr(-4)) > -1) {
    return new modules.PictureMarkerSymbol({
      url: color,
      width: size,
      height: style
    });
  }
  color = new modules.Color(color);
  if (includesEnum(PolylineStyle, style)) {
    return new modules.SimpleLineSymbol({
      style,
      color,
      width: size
    });
  }
  return new modules.TextSymbol({
    color,
    text: style,
    font: {
      size,
      family: "CalciteWebCoreIcons"
    }
  });
};
const paramFour = (...args) => {
  let [size, style, color, fillColor] = args;
  fillColor = new modules.Color(fillColor);
  color = new modules.Color(color);
  if (style == "text") {
    return new modules.TextSymbol({
      color: args[2],
      text: args[3],
      xoffset: 0,
      yoffset: 0,
      horizontalAlignment: "left",
      verticalAlignment: "top",
      font: {
        size,
        family: "微软雅黑"
      }
    });
  }
  var flag = ["circle", "diamond", "cross", "square", "triangle", "x"].indexOf(style) > -1;
  if (flag) {
    return new modules.SimpleMarkerSymbol({
      style,
      size,
      color: fillColor,
      outline: {
        color,
        width: size * 0.1
      }
    });
  }
  style = style.replace("cross-cross", "cross");
  return new modules.SimpleFillSymbol({
    color: fillColor,
    style,
    outline: {
      color,
      width: size
    }
  });
};
function create(...args) {
  return functionApply(args, paramOne, paramTwo, paramThree, paramFour);
}
const popupHandle = (view) => {
  let emitter2, enable = true, onEvent = onEventHandler(view), lastEvent, contents = {}, keyField = {};
  const withHandle = ({
    name: name2,
    delay,
    key,
    leading,
    value,
    title,
    component
  }) => {
    if (isNil(value)) {
      value = key;
      key = "__mark";
    }
    let type = `${name2}-${key}-${value}`;
    keyField[name2] = key;
    contents[type] = new modules.PopupTemplate({
      title,
      content: component.$el || component
    });
    onEvent.withEvent(name2, popupHandle2, delay, leading);
  };
  const popupHandle2 = (ev) => {
    if (!enable)
      return;
    if (view.popup.visible && !!lastEvent && lastEvent.type == "click" && ev.type == "pointer-move") {
      return;
    }
    view.hitTest(ev).then((response) => {
      let features = response.results;
      if (features.length) {
        let graphics = features.map((x) => {
          let mark = x.graphic.getAttribute(keyField[ev.type]) || "";
          let type = ev.type + "-" + keyField[ev.type] + "-" + mark;
          x.graphic.popupTemplate = contents[type];
          return x.graphic;
        });
        view.popup.open({
          features: graphics,
          location: features[0].mapPoint
        });
        if (!!features[0].graphic.attributes) {
          let mark = features[0].graphic.attributes.__mark;
          emitter2 && emitter2(mark, features[0].graphic, features);
        }
        lastEvent = {
          type: ev.type,
          features
        };
      } else {
        if (ev.type == "pointer-move" && !!lastEvent && lastEvent.type == "pointer-move") {
          console.log("move");
          view.popup.close();
        }
      }
    });
  };
  return {
    effect(fn) {
      emitter2 = fn;
    },
    enable: (flag) => {
      enable = flag;
    },
    withClick(param) {
      withHandle(__assign({name: "click", delay: 500, leading: true}, param));
    },
    withMove(param) {
      withHandle(__assign({
        name: "pointer-move",
        delay: 100
      }, param));
    },
    clear(name2) {
      onEvent.remove(name2);
      lastFeatures.forEach((x) => x.graphic.popupTemplate = null);
      view.popup.close();
    }
  };
};
const highlight = (view, lightLayer) => {
  let __highlight, enable = true;
  return {
    value: () => {
      return enable;
    },
    enable: (flag) => {
      enable = flag;
    },
    clear: () => {
      __highlight && __highlight.remove();
    },
    init: () => {
    },
    light: (results) => {
      if (enable && results && results.length) {
        var graphics = results.filter((result) => {
          return result.graphic.layer === lightLayer;
        });
        if (graphics.length > 0) {
          const graphic = graphics[0].graphic;
          view.whenLayerView(graphic.layer).then((layerView) => {
            __highlight && __highlight.remove();
            __highlight = layerView.highlight(graphic);
          });
        }
      }
    }
  };
};
const format = function(param, {tileInfo, spatialReference}) {
  param.group = param.group || "default";
  if (param.type == "tile") {
    param.spatialReference = spatialReference;
    if (isBoolean(tileInfo) && !tileInfo) {
      return {
        id: param.id,
        priority: param.priority,
        url: param.url,
        type: param.type,
        group: param.group
      };
    } else if (isObject$1(tileInfo)) {
      param.tileInfo = tileInfo;
      param.tileInfo.spatialReference = spatialReference;
    }
  }
  return param;
};
const graphicsLayer = (view, id, priority) => {
  let _layer;
  if (!id) {
    _layer = new modules.GraphicsLayer();
    view.map.add(_layer);
  } else {
    _layer = view.map.findLayerById(id);
    if (!_layer) {
      _layer = new modules.GraphicsLayer({id});
      let length = view.map.layers.filter((x) => x["priority"] < priority).length;
      _layer["priority"] = priority || 0;
      !!priority ? view.map.add(_layer, length) : view.map.add(_layer);
    }
  }
  return _layer;
};
function graphicsLayerControl(view, layer) {
  return {
    add(geometry, attrs, symbol) {
      isSymbolType(attrs) && (symbol = attrs, attrs = void 0);
      if (isString(attrs)) {
        attrs = {__id: attrs};
      } else if ("id" in geometry && isString(geometry["id"])) {
        attrs = {__id: geometry["id"]};
      }
      var graphic = createGraphic(view, geometry, attrs, symbol);
      layer.add(graphic);
      return graphic;
    },
    addMany(geoList, cb) {
      const graphics = geoList.map((geometry) => {
        let symbol = !cb ? {} : cb(geometry);
        let attrs = void 0;
        if (isString(geometry["id"])) {
          attrs = {__id: geometry["id"]};
        }
        return createGraphic(view, geometry, attrs, symbol);
      });
      layer.addMany(graphics);
    },
    delete(id) {
      if (!isString(id)) {
        console.error("delete.id错误", id);
        return;
      }
      let graphic = layer.graphics.find((x) => x.attributes["__id"] == id || x.attributes["id"] == id);
      graphic && layer.remove(graphic);
    },
    removeAll() {
      layer.removeAll();
    }
  };
}
const registerToken = ({url, layerUrl, token}) => {
  !!token && modules.IdentityManager.registerToken({
    server: url || layerUrl,
    token
  });
};
const LAYER_PROPERTIES = ["minScale", "maxScale", "opacity", "visible"];
const update = (view, emitEntityList) => {
  const list = Array.isArray(emitEntityList) ? emitEntityList : [emitEntityList];
  list.sort((x, y) => x.reorder - y.reorder).forEach((x) => {
    const ids = filterIds(x, view.map.allLayers);
    updateLayerProperties(view, ids, x);
  });
};
const updateLayerProperties = (view, ids, params) => {
  ids.forEach((id) => {
    const layer = view.map.findLayerById(id);
    if (!!layer) {
      if ("reorder" in params) {
        let priority = layer["priority"] || 0, reorder2 = params["reorder"];
        reorder2 = view.map.layers.filter((x) => x["priority"] <= priority).length + reorder2;
        view.map.layers.reorder(layer, reorder2);
      }
      LAYER_PROPERTIES.forEach((x) => {
        params[x] != void 0 && (layer[x] = params[x]);
      });
    }
  });
};
const filterIds = (emitEntity, layerList) => {
  let {ids, group, exclude} = emitEntity;
  ids = ids || [];
  let __ids = Array.isArray(ids) ? ids : [...ids.split(",")];
  if (!!group) {
    const f = (x) => {
      return group.indexOf(x.group) > -1 && (!exclude ? true : exclude.indexOf(x.id) < 0);
    };
    __ids = layerList.filter(f).map((x) => x.id);
  }
  return __ids;
};
var tileInfo2 = {
  rows: 256,
  cols: 256,
  spatialReference: {},
  compressionQuality: 0,
  origin: {
    x: -180,
    y: 90
  },
  lods: [
    {level: 1, resolution: 0.703125, scale: 29549759305875003e-8},
    {level: 2, resolution: 0.3515625, scale: 14774879652937502e-8},
    {level: 3, resolution: 0.17578125, scale: 7387439826468751e-8},
    {level: 4, resolution: 0.087890625, scale: 36937199132343754e-9},
    {level: 5, resolution: 0.0439453125, scale: 18468599566171877e-9},
    {level: 6, resolution: 0.02197265625, scale: 9234299783085939e-9},
    {level: 7, resolution: 0.010986328125, scale: 4617149891542969e-9},
    {level: 8, resolution: 0.0054931640625, scale: 2.3085749457714846e6},
    {level: 9, resolution: 0.00274658203125, scale: 1.1542874728857423e6},
    {level: 10, resolution: 0.001373291015625, scale: 577143.7364428712},
    {level: 11, resolution: 6866455078125e-16, scale: 288571.8682214356},
    {level: 12, resolution: 34332275390625e-17, scale: 144285.9341107178},
    {level: 13, resolution: 171661376953125e-18, scale: 72142.9670553589},
    {level: 14, resolution: 858306884765625e-19, scale: 36071.48352767945},
    {level: 15, resolution: 4291534423828125e-20, scale: 18035.741763839724},
    {level: 16, resolution: 21457672119140625e-21, scale: 9017.870881919862},
    {level: 17, resolution: 10728836059570312e-21, scale: 4508.935440959931},
    {level: 18, resolution: 5364418029785156e-21, scale: 2254.4677204799655},
    {level: 19, resolution: 2682209014892578e-21, scale: 1127.2338602399827},
    {level: 20, resolution: 1341104507446289e-21, scale: 563.6169301199914}
  ]
};
const tdtMapToken = "993470e78cc4324e1023721f57b23640";
const subDomains = ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"];
var countryLayer2 = [
  {
    urlTemplate: "http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" + tdtMapToken,
    subDomains,
    tileInfo: tileInfo2,
    type: "web-tile",
    spatialReference: {},
    copyright: "国家矢量地图服务",
    mapType: "DLG",
    id: "COUNTRY_DLG01",
    visible: false
  },
  {
    urlTemplate: "http://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" + tdtMapToken,
    subDomains,
    tileInfo: tileInfo2,
    type: "web-tile",
    spatialReference: {},
    copyright: "国家矢量注记地图服务",
    mapType: "DLG",
    id: "COUNTRY_DLG02",
    visible: false
  },
  {
    urlTemplate: "http://{subDomain}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" + tdtMapToken,
    subDomains,
    tileInfo: tileInfo2,
    type: "web-tile",
    spatialReference: {},
    copyright: "国家影像地图服务",
    mapType: "DOM",
    id: "COUNTRY_DOM01",
    visible: false
  },
  {
    urlTemplate: "http://{subDomain}.tianditu.gov.cn/cia_c/wmts?&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" + tdtMapToken,
    subDomains,
    tileInfo: tileInfo2,
    type: "web-tile",
    spatialReference: {},
    copyright: "国家影像注记地图服务",
    mapType: "DOM",
    id: "COUNTRY_DOM02",
    visible: false
  },
  {
    urlTemplate: "http://{subDomain}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" + tdtMapToken,
    subDomains,
    tileInfo: tileInfo2,
    type: "web-tile",
    spatialReference: {},
    copyright: "国家晕渲地图服务",
    mapType: "DEM",
    id: "COUNTRY_DEM01",
    visible: false
  },
  {
    urlTemplate: "http://{subDomain}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" + tdtMapToken,
    subDomains,
    tileInfo: tileInfo2,
    type: "web-tile",
    spatialReference: {},
    copyright: "国家晕渲注记地图服务",
    mapType: "DEM",
    id: "COUNTRY_DEM02",
    visible: false
  }
];
const handleXMConfig = (layerList) => {
  if (!layerList || layerList.length == 0) {
    return [];
  }
  return layerList.map((x) => {
    registerToken(x);
    return {
      url: x.url,
      copyright: x.layerName,
      visible: true,
      type: x.type,
      group: x.group || "xm"
    };
  });
};
const handleCountryLayer = (config, spatialReference) => {
  if (!config) {
    return [];
  }
  return countryLayer2.map((x) => {
    const layer = __assign({}, x);
    layer.tileInfo.spatialReference = spatialReference;
    layer.spatialReference = spatialReference;
    layer.visible = config.indexOf(layer.mapType) > -1;
    layer.group = "country";
    return layer;
  });
};
const initBaseLayers = ({spatialReference, country, layerList}) => {
  const countryLayerList = handleCountryLayer(country, spatialReference);
  const xmLayerList = handleXMConfig(layerList);
  return [...countryLayerList, ...xmLayerList];
};
function FeatureLayerEditor(view, featureLayer, fields) {
  fields.forEach((f) => {
    let t = featureLayer.getField(f.name);
    if (!t)
      throw new Error(`字段配置错误:${f.name}`);
  });
  const fieldConfig = fields.map((element) => {
    let {domain, visible, editorType, hint} = element;
    let field = new modules.FieldConfig({editorType, hint});
    field.name = element.name.trim();
    field.minLength = toNumber(element.minLength);
    field.maxLength = toNumber(element.maxLength);
    visible = visible == "true" ? true : visible == "false" ? false : visible;
    const codedValues = isString(domain) ? JSON.parse(domain) : domain;
    if (visible) {
      if (codedValues.length) {
        field.domain = new modules.CodedValueDomain({
          type: "coded-value",
          name,
          codedValues
        });
      }
      return field;
    }
  });
  let editConfigPoliceLayer = {
    layer: featureLayer,
    fieldConfig
  };
  let editor = new modules.Editor({
    view,
    layerInfos: [editConfigPoliceLayer]
  });
  view.ui.add(editor, "manual");
  return {
    editor,
    clear: () => {
      editor.viewModel.cancelWorkflow();
      view.ui.remove(editor);
    }
  };
}
class CreatePrintTask {
  constructor(view, content) {
    this.ptS = null;
    this.stop = false;
    this.view = view;
    this.content = content;
    this.layer = new modules.GraphicsLayer({id: "__print"});
    this.view.map.add(this.layer);
    this.shapeStrategy = shapeStrategy(view);
  }
  initEvents() {
    let flag = false;
    const event = (ev) => {
      !this.ptS && (this.ptS = this.view.toMap(ev.origin));
      if (ev.action == "start") {
        flag = this.polygon.contains(this.ptS);
      }
      if (flag) {
        const ptEnd = this.view.toMap({x: ev.x, y: ev.y});
        this.update(this.ptS, ptEnd);
        this.ptS = ptEnd;
        ev.stopPropagation();
      }
      if (ev.action == "end") {
        this.ptS = null;
      }
    };
    this.eventHandle = this.view.on("drag", event);
  }
  update(ptS, ptEnd) {
    const x = ptS.x - ptEnd.x;
    const y = ptEnd.y - ptS.y;
    const rings = this.polygon.rings[0].map((element) => {
      let xy = [];
      xy[0] = element[0] - x;
      xy[1] = element[1] + y;
      return xy;
    });
    this.polygon = this.shapeStrategy.polygon(rings);
    this.graphic.geometry = this.polygon;
    this.graphicText.geometry = this.polygon.centroid;
  }
  create({width, height, title = "打印预览，拖动调整打印范围"}) {
    let symbol = create(1, "solid", "#f00", "rgba(255, 255, 0, 0.25)");
    symbol.outline.style = "dash-dot";
    this.graphic = new modules.Graphic({
      symbol
    });
    const rings = this.rectangleFromExtent(width, height, this.view.extent);
    this.polygon = this.shapeStrategy.polygon(rings);
    this.graphic.geometry = this.polygon;
    let fontSymbol = create(16, "text", "#333", title);
    fontSymbol.horizontalAlignment = "center";
    fontSymbol.verticalAlignment = "middle";
    this.graphicText = new modules.Graphic({
      geometry: this.polygon.centroid,
      symbol: fontSymbol
    });
    this.clear();
    this.layer.addMany([this.graphic, this.graphicText]);
    this.initEvents();
    this.scale = this.view.scale;
    return {scale: this.scale};
  }
  clear() {
    this.layer.removeAll();
    if (!!this.eventHandle) {
      this.eventHandle.remove();
      this.eventHandle = null;
    }
  }
  rectangle(width, height) {
    const pixelRatio = window.devicePixelRatio;
    var arrWH = getDPI();
    return [arrWH[0] * width, arrWH[1] * height].map((x) => {
      return x / 2.54 / 2 / pixelRatio;
    });
  }
  rectangleFromExtent(width, height, extent) {
    const {xmax, xmin, ymax, ymin} = extent;
    const ptCenter = new modules.Point({
      x: (xmax + xmin) / 2,
      y: (ymax + ymin) / 2
    });
    var ptScreen = this.view.toScreen(ptCenter);
    const arrWH = this.rectangle(width, height);
    ptScreen.x = ptScreen.x - arrWH[0];
    ptScreen.y = ptScreen.y - arrWH[1];
    var ptMin = this.view.toMap(ptScreen);
    const w = ptCenter.x - ptMin.x;
    const h = ptMin.y - ptCenter.y;
    const pt = ptCenter;
    return [
      [pt.x - w, pt.y - h],
      [pt.x - w, pt.y + h],
      [pt.x + w, pt.y + h],
      [pt.x + w, pt.y - h],
      [pt.x - w, pt.y - h]
    ];
  }
  printParams(options, cb) {
    var printTask = new modules.PrintTask();
    var template = new modules.PrintTemplate({
      outScale: this.scale,
      exportOptions: {dpi: options.dpi},
      layoutOptions: {
        titleText: "",
        authorText: "",
        customTextElements: options
      }
    });
    var params = new modules.PrintParameters({
      view: this.view,
      template,
      outSpatialReference: this.view.spatialReference
    });
    params.extent = this.polygon.extent;
    printTask._getGpPrintParams(params).then((resp) => {
      let Web_Map_as_JSON = JSON.parse(resp.Web_Map_as_JSON);
      Web_Map_as_JSON.operationalLayers = Web_Map_as_JSON.operationalLayers.filter((x) => x.id != "__print");
      cb(JSON.stringify(Web_Map_as_JSON));
    });
  }
}
class ShapeLayer {
  constructor(content, id, symbol) {
    this.content = content;
    this.symbol = symbol;
    this.enable = false;
    this.lastFeatures = [];
    this.view = content.view;
    this.layer = graphicsLayer(this.view, id);
    this.layerControl = graphicsLayerControl(this.view, this.layer);
    this.popupHandle = popupHandle(this.view);
    this.__highlight = highlight(this.view, this.layer);
    this.__highlight.enable(false);
  }
  add(geometry, attrs, symbol) {
    symbol = symbol || this.symbol;
    return this.layerControl.add(geometry, attrs, symbol);
  }
  addMany(geoList) {
    const cb = (geometry) => this.symbol;
    this.layerControl.addMany(geoList, cb);
  }
  update() {
  }
  delete(id) {
    this.layerControl.delete(id);
  }
  clear() {
    this.layerControl.removeAll();
  }
  goTo(...args) {
    args.unshift(this.layer);
    goTo(this.view, args);
    return this;
  }
  effect(fn) {
    this.popupHandle.effect(fn);
    return this;
  }
  get highlight() {
    return this.__highlight.value();
  }
  set highlight(value) {
    this.__highlight.enable(value);
    !value && this.__highlight.clear();
  }
  get graphics() {
    return this.layer.graphics;
  }
  withClick(...args) {
    let key, value, title, component;
    if (args.length == 2) {
      key = "";
      value = "";
      title = args[0];
      component = args[1];
    } else {
      [key, value, title, component] = args;
    }
    this.popupHandle.withClick({key, value, title, component});
    return this;
  }
  withMove(...args) {
    let key, value, title, component;
    if (args.length == 2) {
      key = "";
      value = "";
      title = args[0];
      component = args[1];
    } else {
      [key, value, title, component] = args;
    }
    this.popupHandle.withMove({key, value, title, component});
    return this;
  }
}
class SketchVM {
  constructor(view, param) {
    this.view = view;
    this.enable = true;
    let properties = {
      view,
      defaultUpdateOptions: {
        tool: "reshape",
        enableRotation: false,
        enableScaling: false,
        enableZ: false,
        toggleToolOnClick: false
      },
      updateOnGraphicClick: false,
      defaultCreateOptions: {hasZ: false}
    };
    if (!!param && isObject(param)) {
      this.layer = graphicsLayer(view, param.id);
      param.point && (properties.pointSymbol = param.point);
      param.polygon && (properties.polygonSymbol = param.polygon);
      param.polyline && (properties.polylineSymbol = param.polyline);
      !isNil(param.updateOnGraphicClick) && (properties.updateOnGraphicClick = param.updateOnGraphicClick);
      this.paramEdit = param.edit;
    } else {
      this.layer = graphicsLayer(view, param);
    }
    properties.layer = this.layer;
    this.sketchVM = new modules.SketchViewModel(properties);
    if (this.sketchVM.layer.id == "__draw") {
      this.enable = false;
    }
    this.layerControl = graphicsLayerControl(view, this.layer);
    this.popupHandle = popupHandle(view);
    this.init();
  }
  withClick(key, title, component) {
    this.popupHandle.withClick({key, title, component});
    return this;
  }
  withMove(key, title, component) {
    this.popupHandle.withMove({key, title, component});
    return this;
  }
  remove() {
    this.popupHandle.clear();
  }
  get popup() {
    return this.view.popup;
  }
  init() {
    this.sketchVM.on("create", (event) => {
      this.popupHandle.enable(false);
      if (event.state === "complete") {
        this.popupHandle.enable(true);
        event.graphic.setAttribute("__mark", this.activeMark || event.tool);
        if (this.activeShapeType == "text") {
          event.graphic.symbol = this.sketchVM["textSymbol"];
        }
        this.sketchVM.emit("complete", {
          graphic: event.graphic,
          geometry: event.graphic.geometry,
          type: this.activeShapeType,
          event
        });
        this.lastUpdateGraphic = event.graphic;
        !this.enable && this.layer.remove(event.graphic);
      }
      const eventInfo = event.toolEventInfo;
      if (eventInfo && eventInfo.type === "cursor-update")
        ;
    });
    this.sketchVM.on("update", (event) => {
      if (event.state === "active")
        ;
      event.graphics.forEach((x) => {
        let type = x.getAttribute("__mark");
        let typeSymbol = "circle,rectangle".includes(type) ? "polygon" : type;
        x.symbol = this.paramEdit && this.paramEdit[typeSymbol] || this.sketchVM[typeSymbol + "Symbol"];
      });
      if (event.state === "complete") {
        let type = event.graphics[0].getAttribute("__mark");
        this.sketchVM.emit("complete", {
          graphic: event.graphics[0],
          geometry: event.graphics[0].geometry,
          type,
          event
        });
        this.lastUpdateGraphic = event.graphics[0];
      }
    });
  }
  effect(fn) {
    this.popupHandle.effect(fn);
    return this;
  }
  complete(fn) {
    this.sketchVM.on("complete", (param) => {
      fn(param);
    });
    return this;
  }
  add(geometry, attrs, symbol) {
    symbol = symbol || this.sketchVM[isShapeType(geometry) + "Symbol"];
    this.layerControl.add(geometry, attrs, symbol);
    return this;
  }
  addMany(geoList) {
    const cb = (geometry) => this.sketchVM[isShapeType(geometry) + "Symbol"];
    this.layerControl.addMany(geoList, cb);
    return this;
  }
  update(...args) {
    let graphic = args.shift();
    graphic.symbol = create.apply(this, args);
  }
  create(geometryType, mark) {
    isNotEnumThrow(SketchTypeIndex, geometryType);
    this.activeShapeType = geometryType;
    this.activeMark = mark || geometryType;
    let tool = geometryType == "text" ? "point" : geometryType;
    this.sketchVM.create(tool);
    return this;
  }
  get graphics() {
    return this.layer.graphics;
  }
  clear() {
    this.layer.removeAll();
  }
  delete() {
    if (this.layer.graphics.length == 1) {
      this.layer.removeAll();
    } else {
      this.sketchVM.delete();
    }
  }
  redo() {
    this.sketchVM.redo();
  }
  undo() {
    this.sketchVM.undo();
  }
  cancel() {
    this.sketchVM.cancel();
  }
  destroy() {
    this.sketchVM.destroy();
  }
  active(value) {
    this.sketchVM.updateOnGraphicClick = value;
    return this;
  }
  updateList() {
    let updates = [];
    let graphics = this.sketchVM.updateGraphics;
    graphics = graphics.length == 0 ? this.layer.graphics : graphics;
    if (graphics.length === 0) {
      return;
    } else if (graphics.length == 1) {
      updates = graphics.toArray();
    }
    return updates;
  }
  activeTool(activeTool, graphics) {
    isNotEnumThrow(ActiveToolIndex, activeTool);
    if (!!graphics && graphics.length) {
      this.activeSymbols = graphics.map((x) => x.symbol);
    }
    if (this.layer.graphics.length == 1) {
      graphics = this.layer.graphics.toArray();
    }
    this.sketchVM.updateOnGraphicClick = true;
    this.sketchVM.update(graphics, {
      tool: activeTool || "reshape",
      enableRotation: true,
      enableScaling: true,
      preserveAspectRatio: true,
      toggleToolOnClick: true
    });
  }
}
const pointToArray = (point) => {
  return Array.isArray(point) ? point : [point.x, point.y];
};
const shapeStrategy = (_view) => {
  const view = _view;
  return {
    point(point) {
      if (!point) {
        console.log("ShapeStrategy-入参为空");
        return null;
      }
      const _point = pointToArray(point);
      return new modules.Point({
        longitude: _point[0],
        latitude: _point[1],
        spatialReference: view.spatialReference
      });
    },
    text(point) {
      return this.point(point);
    },
    polyline(vertices) {
      if (!vertices || !Array.isArray(vertices)) {
        return null;
      }
      return new modules.Polyline({
        paths: [vertices.map(pointToArray)],
        spatialReference: view.spatialReference
      });
    },
    polygon(vertices) {
      if (!vertices || !Array.isArray(vertices)) {
        return null;
      }
      return new modules.Polygon({
        rings: [vertices.map(pointToArray)],
        spatialReference: view.spatialReference
      });
    }
  };
};
const createGraphic = (view, geometry, attributes, symbol) => {
  let graphic = null;
  if ("screenPoint" in geometry) {
    graphic = modules.Graphic.fromJSON({
      geometry: view.toMap(geometry.screenPoint)
    });
  } else if ("x" in geometry && "y" in geometry) {
    graphic = modules.Graphic.fromJSON({
      geometry
    });
  } else if ("lng" in geometry && "lat" in geometry) {
    graphic = modules.Graphic.fromJSON({
      geometry: {x: parseFloat(geometry.lng), y: parseFloat(geometry.lat)}
    });
  } else if ("attributes" in geometry && "geometry" in geometry) {
    graphic = modules.Graphic.fromJSON(geometry);
  } else {
    graphic = modules.Graphic.fromJSON({geometry});
  }
  attributes && (graphic.attributes = attributes);
  if (!isNil(symbol)) {
    graphic.symbol = !symbol ? create(isShapeType(graphic.geometry)) : symbol;
  }
  if (!graphic.geometry) {
    console.error(geometry);
    throw new Error(`图形创建失败`);
  }
  graphic.geometry.spatialReference = view.spatialReference;
  return graphic;
};
const isShapeType = (geometry) => {
  if ("rings" in geometry) {
    return ShapeTypeIndex.Polygon;
  } else if ("paths" in geometry) {
    return ShapeTypeIndex.Polyline;
  } else if ("points" in geometry) {
    return ShapeTypeIndex.Point;
  } else if ("x" in geometry && "y" in geometry) {
    return ShapeTypeIndex.Point;
  } else {
    console.error("type error");
  }
};
function GIS(_2) {
  const view = _2;
  class Shape {
    constructor(id, priority) {
      this.onEvent = onEventHandler(view);
      if (!!id) {
        this.layer = graphicsLayer(view, id, priority);
      }
    }
    withPoint(geometry) {
      if (!geometry) {
        console.error("geometry 不能为空");
        return;
      }
      if (this.graphic) {
        this.update(geometry);
      } else {
        this.graphic = createGraphic(view, geometry);
      }
      return this;
    }
    withTitle(title) {
      if (!this.graphic) {
        throw new Error("请先执行withPoint");
      }
      this.graphic.popupTemplate = new modules.PopupTemplate({title});
      return this;
    }
    withAttrs(title) {
      this.graphic.attributes = {};
      return this;
    }
    withSymbol(...args) {
      const name2 = args[0];
      if ("default,pickup".indexOf(name2) > -1) {
        this.symbol = symbolStrategy(name2)[isShapeType(this.graphic.geometry)];
      } else {
        this.symbol = create.apply(this, args);
      }
      if (this.graphic) {
        this.graphic.symbol = this.symbol;
      }
      return this;
    }
    withPopup(title, component) {
      this.graphic.popupTemplate = new modules.PopupTemplate({
        title,
        outFields: ["*"]
      });
      if (component) {
        this.graphic.popupTemplate.content = component.$el || component;
      }
      return this;
    }
    open() {
      setTimeout(() => {
        view.popup.open({
          features: [this.graphic],
          location: this.center()
        });
      }, 500);
      return this;
    }
    build() {
      if (this.symbol)
        this.graphic.symbol = this.symbol;
      this.symbol = this.graphic.symbol;
      !this.layer ? view.graphics.add(this.graphic) : this.layer.add(this.graphic);
      return this;
    }
    update(geometry) {
      this.graphic.geometry = createGraphic(view, geometry, null, null).geometry;
      if (view.popup.visible) {
        view.popup.location = this.center();
      }
      return this;
    }
    center() {
      let geometry = this.graphic.geometry;
      return geometry.extent ? geometry.extent.center : geometry;
    }
    remove() {
      !this.layer ? view.graphics.remove(this.graphic) : this.layer.remove(this.graphic);
      return this;
    }
    removeAll() {
      !this.layer ? view.graphics.removeAll() : this.layer.removeAll();
      return this;
    }
    withEvent(name2, cb) {
      this.onEvent["on" + capitalize(camelize(name2))](this.graphic, cb);
      return this;
    }
    withLeaveRemove() {
      this.onEvent.onMouseLeave(this.graphic, (g) => {
        const layer2 = g.layer;
        layer2.remove(g);
        view.popup.close();
        this.onEvent.remove("pointer-move");
      });
      return this;
    }
    withSketch(activeTool = "reshape") {
      if (!this.layer) {
        console.error("图层不存在，请在构建的时候传入图层id");
        return;
      }
      if (!this.sketchVM && !this.layer["sketchVM"]) {
        this.sketchVM = new modules.SketchViewModel({
          view,
          layer: this.layer
        });
        this.layer["sketchVM"] = this.sketchVM;
        this.onEvent.onMove((graphics) => {
          this.sketchVM.state != "active" && this.sketchVM.update(graphics, {
            tool: activeTool
          });
        });
        this.sketchVM.on("update", (event) => {
          invokeFns(this.effectSet, {
            geometry: event.graphics[0].geometry,
            type: event.type,
            event
          });
          event.graphics.forEach((x) => {
            this.symbol && (x.symbol = this.symbol);
          });
        });
      } else {
        this.sketchVM = this.layer["sketchVM"];
      }
      view.popup.close();
      this.sketchVM.update(this.layer.graphics.toArray(), {tool: activeTool});
      return this;
    }
    effect(fn) {
      if (!this.effectSet) {
        this.effectSet = new Set();
      }
      this.effectSet.add(fn);
    }
    goTo(...args) {
      args.unshift(this.graphic);
      goTo(view, args);
      return this;
    }
  }
  return {
    Shape
  };
}
const onEventHandler = (view) => {
  let eventHandles = {};
  let lastGraphic;
  const withEvent = (eventName, fn, delay, leading = false) => {
    const name2 = eventName;
    if (hasOwn(eventHandles, name2)) {
      eventHandles[name2].remove();
    }
    if (!!delay) {
      eventHandles[name2] = view.on(eventName, debounce(fn, delay, {leading}));
    } else {
      eventHandles[name2] = view.on(eventName, fn);
    }
  };
  const hitTest = (cb) => (ev) => {
    view.hitTest(ev).then((response) => {
      let features = response.results;
      if (features.length) {
        cb(features.map((x) => x.graphic));
      }
    });
  };
  return {
    onMouseLeave: (graphic, cb) => {
      let handle = (ev) => {
        view.hitTest(ev).then((response) => {
          let features = response.results;
          if (features.length) {
            lastGraphic = features[0].graphic;
          } else {
            if (!!lastGraphic && graphic == lastGraphic) {
              cb(lastGraphic);
              lastGraphic = null;
            }
          }
        });
      };
      withEvent("pointer-move", handle, 0);
    },
    onClick: (cb) => {
      withEvent("click", hitTest(cb));
    },
    onMove: (cb) => {
      withEvent("pointer-move", hitTest(cb));
    },
    withEvent,
    remove(name2) {
      if (!name2) {
        Object.values(eventHandles).forEach((x) => x.remove());
      } else {
        eventHandles[name2].remove();
      }
    }
  };
};
const _goTo = (view, pt, zoom) => {
  let target = "";
  if (!!pt.graphic) {
    target = pt.graphic;
    !zoom ? view.goTo(target) : view.goTo({target, zoom});
  } else if (isGraphicType(pt)) {
    !zoom ? view.goTo(target) : view.goTo({target, zoom});
  } else {
    pt = formatToPoint(pt);
    goToExtend(view, pt, zoom);
  }
};
const goToExtend = (view, pt, zoom) => {
  let extent = view.extent, cz = zoom - view.zoom;
  if (!extent) {
    console.error(view);
    throw new Error("view 中不存在extent");
  }
  let factor = cz > 0 ? 0.5 : 2;
  cz = Math.abs(cz);
  while (cz > 0) {
    extent = extent.expand(factor);
    cz--;
  }
  let geo = panExtentFromPoint(pt, extent);
  let graphic = shapeStrategy(view).polyline(geo);
  view.goTo(graphic);
};
const goTo = (view, args) => {
  const paramOne2 = (param) => {
    if (typeof param === "string") {
      if (param.indexOf(",") > -1) {
        let [xmin, ymin, xmax, ymax] = param.split(",");
        let graphic = shapeStrategy(view).polyline([
          [xmin, ymin],
          [xmax, ymax]
        ]);
        view.goTo(graphic);
      } else {
        let layer = view.map.findLayerById(param);
        !layer ? console.log("图层不存在无法定位") : view.goTo(layer.graphics);
      }
    } else if ("graphics" in param) {
      let layer = param;
      view.goTo(layer.graphics);
    } else if (isArray$1(param)) {
      param = param.map((x) => {
        const type = isShapeType(x);
        return shapeStrategy(view)[type](x);
      });
      view.goTo(param);
    } else {
      view.goTo(param);
    }
  };
  const paramTwo2 = (...args2) => {
    const [pt, opts] = args2;
    if (typeof opts === "string" || typeof opts === "number") {
      _goTo(view, pt, opts);
    } else {
      view.goTo(args2[0], args2[1]);
    }
  };
  return functionApply(args, paramOne2, paramTwo2);
};
const panExtentFromPoint = (pt, extent) => {
  const {xmax, xmin, ymax, ymin} = extent;
  const w = (xmax - xmin) / 2;
  const h = (ymax - ymin) / 2;
  return [
    [pt.x - w, pt.y - h],
    [pt.x - w, pt.y + h],
    [pt.x + w, pt.y + h],
    [pt.x + w, pt.y - h],
    [pt.x - w, pt.y - h]
  ];
};
const formatToPoint = (pt) => {
  if (isObject$1(pt) && "x" in pt && "y" in pt) {
    return pt;
  }
  let pts = isString$1(pt) ? pt.split(",") : pt;
  pts = pts.map((x) => parseFloat(x));
  if (pts.length == 4) {
    const [xmin, ymin, xmax, ymax] = pts;
    return {xmin, ymin, xmax, ymax};
  } else if (pts.length == 2) {
    const [x, y] = pts;
    return {x, y};
  }
};
var initUI = (view, widgets, list) => {
  Object.keys(list).forEach((key) => {
    let param = list[key];
    if (typeof param == "boolean") {
      param = {};
    }
    param.view = view;
    let positionUI = param.positionUI == void 0 ? "manual" : param.positionUI;
    var component = new modules[key](param);
    view.ui.add(component, positionUI);
    widgets[key] = component;
  });
};
const getMapPointFromMenuPosition = (view, box) => {
  var {x, y} = box;
  switch (box.corner) {
    case "TR":
      x += box.w;
      break;
    case "BL":
      y += box.h;
      break;
    case "BR":
      x += box.w;
      y += box.h;
      break;
  }
  return view.toMap({
    x: x - view.position[0],
    y: y - view.position[1]
  });
};
const menu = (view, list) => {
  let point = null;
  let menu2 = new modules.Menu({});
  menu2.onOpen = (box) => {
    point = getMapPointFromMenuPosition(view, box);
  };
  list.forEach((x) => {
    const {onClick} = x;
    x.onClick = (ev) => {
      ev.point = point;
      onClick(ev);
    };
    menu2.addChild(new modules.MenuItem(x));
  });
  menu2.startup();
  menu2.bindDomNode(view.container);
  return menu2;
};
const emitter = mitt();
class App extends Bus {
  constructor(param) {
    super();
    this.hitTest = false;
    this.isPopup = false;
    this.layerList = [];
    !!param && emitter.on("load", () => {
      this.initMapView(param);
    });
  }
  run() {
  }
  async init(param) {
    await this.initMapView(param);
  }
  async initMapView(param) {
    this.mapViewOption = param;
    const {
      extent,
      zoom,
      center: center2,
      wkid,
      country,
      layerList,
      container,
      wkt,
      tileInfo,
      widgets
    } = param;
    const spatialReference = new modules.SpatialReference({wkid, wkt});
    const baseLayers = initBaseLayers({spatialReference, country, layerList});
    this.layerList.push(...baseLayers);
    const map = await createMap({
      basemap: {
        baseLayers,
        title: "底图",
        id: "base"
      }
    });
    const viewProperties = {container, map};
    if (tileInfo == false)
      ;
    else {
      viewProperties.spatialReference = spatialReference;
    }
    if (extent) {
      viewProperties.extent = new modules.Extent(formatToPoint(extent));
    }
    zoom && (viewProperties.zoom = parseInt(zoom));
    if (center2) {
      let centers = center2.split(",").map(parseFloat);
      viewProperties.center = new modules.Point({
        longitude: centers[0],
        latitude: centers[1],
        spatialReference
      });
    }
    viewProperties.popup = {
      actions: [],
      dockEnabled: false,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false
      },
      autoCloseEnabled: true,
      spinnerEnabled: false,
      highlightEnabled: false,
      alignment: "top-right"
    };
    this.view = await createMapView(viewProperties);
    this.mapViewOption.spatialReference = this.view.spatialReference;
    this.initUI(widgets);
    viewEvents(this);
    this.gis = GIS(this.view);
    this.emit("init", this.view);
    return this;
  }
  initUI(widgets) {
    ["zoom", "attribution"].forEach((x) => this.view.ui.remove(x));
    this.widgets = this.widgets || {};
    initUI(this.view, this.widgets, widgets || {});
    return this.widgets;
  }
  async addBase(country) {
    const baseLayers = initBaseLayers({
      spatialReference: this.view.spatialReference,
      country,
      layerList: []
    });
    let layer2 = await createLayers(baseLayers);
    this.view.map.addMany(layer2, 0);
  }
  initMenu(list) {
    this.menu = menu(this.view, list);
    return this.menu;
  }
  static async initArcGisJsApi(baseUrl, cb) {
    await loadScript({
      url: `${baseUrl}/init.js`,
      css: `${baseUrl}/esri/css/main.css`,
      dojoConfig: {
        async: true,
        locale: "zh-cn",
        has: {
          "esri-native-promise": true
        }
      }
    });
    await initModules();
    emitter.emit("load");
    cb && cb();
  }
  findLayerById(id) {
    return this.view.map.findLayerById(id);
  }
  async add(props) {
    registerToken(props);
    props = format.call(this, props, this.mapViewOption);
    const {id} = props;
    let layer2 = this.findLayerById(id);
    if (!!layer2)
      return layer2;
    if (!props["type"]) {
      console.error("type 不能为空", props);
      return;
    }
    layer2 = await createLayer(props);
    this.layerList.push(layer2);
    if (props["priority"] || props["reorder"]) {
      let priority = props["priority"] || 0, reorder2 = props["reorder"] || 0;
      reorder2 = this.view.map.layers.filter((x) => x["priority"] <= priority).length + reorder2;
      this.view.map.add(layer2, reorder2);
    } else {
      this.view.map.add(layer2);
    }
    return this.view.whenLayerView(layer2);
  }
  async addMany(layList, priority) {
    const list = layList.map((props) => {
      registerToken(props);
      return format.call(this, props, this.mapViewOption);
    });
    const layers = await createLayers(list);
    this.layerList.push(...layers);
    this.view.map.addMany(layers, priority);
    return this.layerList;
  }
  delete(id, oid) {
    const layer2 = this.findLayerById(id);
    layer2 && this.view.map.remove(layer2);
  }
  get(id) {
    return this.findLayerById(id);
  }
  getMany(name2) {
    return this.layerList.filter((x) => x.group == name2);
  }
  update(emitEntity) {
    update(this.view, emitEntity);
  }
  goTo(...args) {
    goTo(this.view, args);
  }
  createShape() {
    return new this.gis.Shape();
  }
  shape(id, priority) {
    return new this.gis.Shape(id, priority);
  }
  createShapes(geoList, symbol) {
    console.log("未开发");
  }
  createSymbol(...args) {
    return create.apply(this, args);
  }
  createShapeLayer(id, symbol) {
    return new ShapeLayer(this, id, symbol);
  }
  createSketch(param) {
    return new SketchVM(this.view, param);
  }
  printTask(view) {
    let __view = view || this.view;
    return new CreatePrintTask(__view, this);
  }
  widthEditor(id, fieldConfig) {
    let layer2 = this.findLayerById(id);
    if (!layer2) {
      throw new Error("FeatureLayer 不存在");
    }
    return FeatureLayerEditor(this.view, layer2, fieldConfig);
  }
  viewInfo() {
    const {extent, center: center2, scale, zoom, size} = this.view;
    return {
      dpi: getDPI(),
      extent,
      center: {x: center2.x, y: center2.y},
      scale,
      size,
      zoom,
      layerList: this.layerList
    };
  }
}
App.help = () => {
  Object.keys(Index).forEach((x) => {
    console.table(Index[x]);
  });
};
App.Index = Index;
App.shared = shared;
export default App