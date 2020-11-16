/** @format */
const fn = {
  queryData(geometry) {
    const layer = gis.get(this.layerId);

    const query = {
      geometry,
      distance: 2,
      units: 'miles',
      spatialRelationship: 'intersects',
      returnGeometry: true,
      outFields: ['*'],
    };

    layer.queryFeatures(query).then(function(results) {
      console.log(results.features);
    });
  },
}



// 是否相交
const test = {

  intersects(event) {
 
      const graphic = event.graphics[0];    
      // 是否相交
      intersects = geometryEngine.intersects(buffers, graphic.geometry);
      graphic.symbol = intersects ? invalidSymbol : validSymbol;

      const toolType = event.toolEventInfo.type;
      if (event.toolEventInfo && (toolType === 'move-stop' || toolType === 'reshape-stop')) {
        if (!intersects) {
          sketch.complete();
        }
      } else if (event.state === 'complete') {
        // graphic update has been completed
        // if the graphic is in a bad spot, call sketch's update method again
        // giving user a chance to correct the location of the graphic
        if (!contains || intersects) {
          sketch.update({
            tool: 'reshape',
            graphics: [graphic],
            toggleToolOnClick: false,
          });
        }
      }

    },

    // set the geometry query on the visible SceneLayerView
        var debouncedRunQuery = promiseUtils.debounce(function() {
          if (!sketchGeometry) {
            return;
          }

          resultDiv.style.display = "block";
          updateBufferGraphic(bufferSize);
          return promiseUtils.eachAlways([
            queryStatistics(),
            updateSceneLayer()
          ]);
        });

        function runQuery() {
          debouncedRunQuery().catch((error) => {
            if (error.name === "AbortError") {
              return;
            }

            console.error(error);
          });
        }

  // update the graphic with buffer
        function updateBufferGraphic(buffer) {
          // add a polygon graphic for the buffer
          if (buffer > 0) {
            var bufferGeometry = geometryEngine.geodesicBuffer(
              sketchGeometry,
              buffer,
              "meters"
            );
            if (bufferLayer.graphics.length === 0) {
              bufferLayer.add(
                new Graphic({
                  geometry: bufferGeometry,
                  symbol: sketchViewModel.polygonSymbol
                })
              );
            } else {
              bufferLayer.graphics.getItemAt(0).geometry = bufferGeometry;
            }
          } else {
            bufferLayer.removeAll();
          }
        }

}

 