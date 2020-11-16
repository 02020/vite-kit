/**
 * 鼠标移入高亮
 *
 * @format
 * @param view
 */


//  通过 bus 来控制
// 入参为 false 关闭高亮
const highlight = (view, lightLayer) => {
  let __highlight,
    enable = true
    
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

    // 可嵌入其他的应用监听中
    // 点击事件 或移入事件 监听返回
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
    },

    set(graphic) {
      view.whenLayerView(graphic.layer).then((layerView) => {
        __highlight && __highlight.remove();
        __highlight = layerView.highlight(graphic);
      });
    },

   
  };
};

export { highlight };
