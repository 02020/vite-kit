```ts

  const citiesLayerUrl = 'http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/2'

  var queryTask = new modules.QueryTask({
    url: citiesLayerUrl
  });
  var query = new modules.Query();
  query.returnGeometry = true;
  query.outFields = ["*"];
  query.where = "1=1";  // Return all cities with a population greater than 1 million

  // When resolved, returns features and graphics that satisfy the query.
  queryTask.execute(query).then(function(results){
    console.log(JSON.stringify(results.features));
  });

  console.table(graphics);
  
```