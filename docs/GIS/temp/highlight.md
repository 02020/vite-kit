```ts
// highlight feature on pointer-move
var highlight;
view.on("pointer-move", function(event){
  view.hitTest(event).then(function(response){
    if (response.results.length) {
      var graphic = response.results.filter(function (result) {
        return result.graphic.layer === treesLayer;
      })[0].graphic;

      
     view.whenLayerView(graphic.layer).then(function(layerView){
       if (highlight) {
     		highlight.remove();
   	   }
       layerView.highlight(graphic);
     });
    }
  });
});

```


```ts
var highlight;
view.whenLayerView(treesLayer).then(function(layerView){
 var query = treesLayer.createQuery();
 query.where = "type = 'Quercus'";
 treesLayer.queryFeatures(query).then(function(result){
   if (highlight) {
     highlight.remove();
   }
   highlight = layerView.highlight(result.features);
 })
});

```