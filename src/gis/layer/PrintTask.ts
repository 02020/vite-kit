/** @format */

import { modules } from '../core';
import { createSymbol, shapeStrategy } from '../common';
import { getDPI } from '../../shared';

export default class CreatePrintTask {
  view: __esri.MapView;
  eventHandle: __esri.Handle;
  polygon: __esri.Polygon;
  private ptS: any = null;
  private layer: __esri.GraphicsLayer;
  content: any;
  stop: boolean = false;
  private graphic: __esri.Graphic;
  private graphicText: __esri.Graphic;

  // 创建预览框时的比例尺
  public scale: number;
  shapeStrategy: ShapeStrategy;
  constructor(view: __esri.MapView, content) {
    this.view = view;
    this.content = content;
    this.layer = new modules.GraphicsLayer({ id: '__print' });
    this.view.map.add(this.layer);
    this.shapeStrategy = shapeStrategy(view);
  }
  private initEvents() {
    let flag = false;
    const event = (ev) => {
      // console.log(ev)
      !this.ptS && (this.ptS = this.view.toMap(ev.origin));

      if (ev.action == 'start') {
        flag = this.polygon.contains(this.ptS);
      }

      if (flag) {
        const ptEnd = this.view.toMap({ x: ev.x, y: ev.y });
        this.update(this.ptS, ptEnd);
        this.ptS = ptEnd;

        ev.stopPropagation();
      }

      if (ev.action == 'end') {
        this.ptS = null;
      }
    };
    this.eventHandle = this.view.on('drag', event);
  }
  // 更新图形
  private update(ptS, ptEnd) {
    const x = ptS.x - ptEnd.x;
    const y = ptEnd.y - ptS.y;

    const rings = this.polygon.rings[0].map((element) => {
      let xy = [];
      xy[0] = element[0] - x;
      xy[1] = element[1] + y;
      return xy;
    });

    this.polygon = this.shapeStrategy.polygon(rings);
    // 矩形框
    this.graphic.geometry = this.polygon;
    this.graphicText.geometry = this.polygon.centroid;
  }
  // 创建预览框
  create({ width, height, title = '打印预览，拖动调整打印范围' }) {
    // 打印预览,拖动调整打印范围
    let symbol = createSymbol(1, 'solid', '#f00', 'rgba(255, 255, 0, 0.25)');
    symbol.outline.style = 'dash-dot';
    this.graphic = new modules.Graphic({
      symbol,
    });

    const rings = this.rectangleFromExtent(width, height, this.view.extent);
    this.polygon = this.shapeStrategy.polygon(rings);
    this.graphic.geometry = this.polygon;

    let fontSymbol = createSymbol(
      16,
      'text',
      '#333',
      title
    ) as __esri.TextSymbol;

    fontSymbol.horizontalAlignment = 'center';
    fontSymbol.verticalAlignment = 'middle';

    this.graphicText = new modules.Graphic({
      geometry: this.polygon.centroid,
      symbol: fontSymbol,
    });

    this.clear();

    this.layer.addMany([this.graphic, this.graphicText]);
    this.initEvents();

    this.scale = this.view.scale;
    return { scale: this.scale };
  }
  clear() {
    this.layer.removeAll();
    if (!!this.eventHandle) {
      this.eventHandle.remove();
      this.eventHandle = null;
    }
  }

  // 矩形大小
  rectangle(width, height) {
    const pixelRatio = window.devicePixelRatio;
    //宽高单位cm

    var arrWH = getDPI();

    return [arrWH[0] * width, arrWH[1] * height].map((x) => {
      return x / 2.54 / 2 / pixelRatio;
    });
  }
  // 根据当前四至绘制矩形框
  rectangleFromExtent(width, height, extent) {
    const { xmax, xmin, ymax, ymin } = extent;

    const ptCenter = new modules.Point({
      x: (xmax + xmin) / 2,
      y: (ymax + ymin) / 2,
      spatialReference:this.view.spatialReference
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
      [pt.x - w, pt.y - h],
    ];
  }

  printParams(options: any, cb) {
    var printTask = new modules.PrintTask() as any;

    var template = new modules.PrintTemplate({
      outScale: this.scale,
      exportOptions: { dpi: options.dpi },
      layoutOptions: {
        titleText: '',
        authorText: '',
        customTextElements: options,
      },
    });
    // console.log(template);
    var params = new modules.PrintParameters({
      view: this.view,
      template: template,
      outSpatialReference: this.view.spatialReference,
    }) as any;
    // 矩形框范围
    params.extent = this.polygon.extent;

    // 获取参数
    printTask._getGpPrintParams(params).then((resp) => {
      let Web_Map_as_JSON = JSON.parse(resp.Web_Map_as_JSON);
      Web_Map_as_JSON.operationalLayers = Web_Map_as_JSON.operationalLayers.filter(
        (x) => x.id != '__print'
      );
      cb(JSON.stringify(Web_Map_as_JSON));
    });
  }
}

/*

     const printResult = (resp) => {
      window.open(resp.url, '_blank');
    };
    const printError = (resp) => {
      console.log(resp);
    };
    printTask.execute(params).then(printResult, printError);


    this.view.on('drag', (ev) => {
    console.log(ev)
 
      this.view.hitTest(ev).then((response) => {
        if (response.results.length > 0) {
          this.stop = true;
        } else {
        
        }
      });
 
    });

*/
