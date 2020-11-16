
import Bus from './pubsub';
import layerCURD from './layer-curd';
import esriMapEmit from './emit';
import {  initEsriEmit } from './initEvents';

export default class EsriBus extends Bus {
  events:Array<any>=[];
  layerList: Array<any>;
  view: __esri.View;
 
  gis:any;
  draw: any;
  /** 提供给组件使用 */
  private currentGraphic: __esri.Graphic;

  enable: boolean; // 启用事件分发

  constructor(content) {
    super();
    this.gis = content
    this.layerList = [];
 
    this.enable = true;
  }

  init(view) {
    this.view = view;

    initEsriEmit(view, this, this.gis);
  } 
  // todo
  /**
   * @event curd
   * @param {*} id
   * @param {*} name
   * @param {*} type
   * @param {*} group
   */
  curd(id, name?, type?, group?) {
    this.layerList.push({ id, name, type, group });

    ['add', 'select', 'update', 'delete'].forEach((x) => {
      // const eventName = 'esri' === layerId ? layerId : current + '-' + layerId;

      var m = 'esri' === id ? esriMapEmit(x, this) : layerCURD[x];

      this.on(id + '-' + x, m);
    });
  }

  /**
   * 增加多个图层
   * @function addMany
   * @param {Array} list List<layerInfo>
   * @param {String} group 组名
   */
  addMany(list, group) {
    // 增加地图已经存在判断
    const _list = list.reduce((init, cur) => {
      cur.visible = false;
      // let ly ={} //baseLayer(cur);
      if (!this.findLayerById(cur.id)) {
        // this.curd(ly.id, cur.layerName, cur.layerType, group);
        init.push(cur);
        return init;
      }
    }, []);

    console.log(_list);

    // fixme 暂时注释掉
    // this.view.map.addMany(_list);
  }
  // 获取图层
  findLayerById(id) {
    return this.view.map.findLayerById(id);
  }
  /**
   *  显示弹窗
   */
  popupInfo(response) {
    // if (!this.isPopup || !this.hitTest) {
    //   this.currentGraphic = null;
    //   return;
    // }
    const view = this.view;

    response.results.forEach((x) => {
      if ((x.graphic.type = 'polygon')) {
        // x.graphic.centroid
      }

      this.currentGraphic = x.graphic;

      const shape = x.graphic.$shape;

      if (!shape || !shape.popup) return;

      const comp = shape.popup.content;
      console.log('x.graphic', x.graphic.attributes);
      console.log('组件', comp);

      if (!comp) return;

      Object.keys(comp.attrs).forEach((key) => {
        comp.attrs[key] = x.graphic.attributes[key];
      });

      this.popup({
        title: shape.popup.title,
        content: comp.$el,
        location: x.mapPoint,
        visible: true,
        dockOptions: {
          buttonEnabled: false,

          breakpoint: {
            width: 600,
            height: 1000,
          },
        },
      });
      // x.graphic.layer.remove(x.graphic)  centroid
    });
  }

  popup(keys) {
    const { popup } = this.view;
    Object.keys(keys).forEach((key) => {
      popup[key] = keys[key];
    });

    console.log('修改-popup', popup);
  }

  /**
   * 修改图形 属性\样式
   * @param attrs
   * @param symbol
   */
  update(attrs, symbol) {
    if (!this.currentGraphic) {
      console.log('图形不存在');
      return;
    }
    // const shape = this.currentGraphic.$shape;
    // console.log("esri-update", arguments);
    // if (!!attrs) shape.attrs(attrs);
    // if (!!symbol) shape.style(symbol);
  }
  /**
   *  删除
   */
  delete() {
    if (!this.currentGraphic) {
      console.log('图形不存在');
      return;
    }
    // this.currentGraphic.layer.remove(this.currentGraphic);
  }

  remove() {}

  removeMany() {}

  /** 修改图层 */
  reorder() {}
}

// https://github.com/ytftianwen/dynamic-vue-bus/blob/master/index.js
// https://github.com/wowill/vue-event-bus/blob/master/index.js
// https://juejin.im/post/5ea1a96c51882573672232a7  装饰器
