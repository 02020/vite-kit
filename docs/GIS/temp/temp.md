```ts

/** @format */

import { modules } from '../core';

export function FeatureLayerEditor(
  view: __esri.MapView,
  featureLayer: __esri.FeatureLayer,
  container: any
) {
  let fieldConfig: any = [
    {
      name: 'MC',
      label: '我是中文',
      domain: [
        { name: '11', code: '222' },
        { name: '11', code: '222' },
      ],
    },
  ];

  // let codedValues:__esri.CodedValueDomain

  // codedValues.codedValues = [{name:"",code:""}]

  /*


*/
  // console.log(featureLayer, featureLayer.get('fields'));

  let domain = new modules.CodedValueDomain({
    name: 'test1',
    type: 'coded-value',
  });

  domain.codedValues = [
    { name: '11', code: '222' },
    { name: '11', code: '222' },
  ];

  let f = featureLayer.getField('MC');
  // f.valueType='date-and-time'
  // f.type='date'
  f.valueType = 'type-or-category';

  function selectFeature(objectId) {
    // query feature from the server
    featureLayer
      .queryFeatures({
        objectIds: [objectId],
        outFields: ['*'],
        returnGeometry: true,
      })
      .then(function (results) {
        if (results.features.length > 0) {
          //
          // editFeature = results.features[0];
          // // display the attributes of selected feature in the form
          // featureForm.feature = editFeature;
          // // highlight the feature on the view
          // view.whenLayerView(editFeature.layer).then(function(layerView) {
          //   highlight = layerView.highlight(editFeature);
          // });
        }
      });
  }
let features

 


  // layer.getField('MC').domain = domain;
  let editConfigPoliceLayer: __esri.LayerInfo = {
    layer: featureLayer,
    fieldConfig,
  };

  let editor = new modules.Editor({
    view: view,
    // Pass in the configurations created above
    layerInfos: [editConfigPoliceLayer],

    // Override the default template behavior of the Editor widget
    supportingWidgetDefaults: {
      // startUpdateWorkflowAtFeatureSelection()
      featureTemplates: {},
    },
  });

  view.on('click', function (event) {
    // clear previous feature selection

    view.hitTest(event).then(function (response) {
      if (!editor.viewModel.activeWorkflow) {
        editor.startUpdateWorkflowAtFeatureEdit(response.results[0].graphic);
      }

    });
    // editor.viewModel.cancelWorkflow();
  });


  
  function editThis() {
    // If the EditorViewModel's activeWorkflow is null, make the popup not visible
    if (!editor.viewModel.activeWorkflow) {
      view.popup.visible = false;
      // Call the Editor update feature edit workflow

      editor.startUpdateWorkflowAtFeatureEdit(
        view.popup.selectedFeature
      );
      view.ui.add(editor, "top-right");
      view.popup.spinnerEnabled = false;
    }

    // We need to set a timeout to ensure the editor widget is fully rendered. We
    // then grab it from the DOM stack
    // setTimeout(function() {
    //   // Use the editor's back button as a way to cancel out of editing
    //   let arrComp = editor.domNode.getElementsByClassName(
    //     "esri-editor__back-button esri-interactive"
    //   );
    //   if (arrComp.length === 1) {
    //     // Add a tooltip for the back button
    //     arrComp[0].setAttribute(
    //       "title",
    //       "Cancel edits, return to popup"
    //     );
    //     // Add a listerner to listen for when the editor's back button is clicked
    //     arrComp[0].addEventListener("click", function(evt) {
    //       // Prevent the default behavior for the back button and instead remove the editor and reopen the popup
    //       evt.preventDefault();
    //       view.ui.remove(editor);
    //       view.popup.open({
    //         features: features
    //       });
    //     });
    //   }
    // }, 150);
  }


  const template = {
    title: "Trail name: {trailName}",
    // content: difficultyLevel,
    fieldInfos: [
      {
        fieldName: "trailName"
      },
      {
        fieldName: "difficulty"
      }
    ],
    // actions: [editThisAction]
  };
  featureLayer.on("apply-edits", function() {
    // Once edits are applied to the layer, remove the Editor from the UI
    view.ui.remove(editor);

    // Iterate through the features
    features.forEach(function(feature) {
      // Reset the template for the feature if it was edited
       feature.popupTemplate = template;
    });

    // Open the popup again and reset its content after updates were made on the feature
    if (features) {
      view.popup.open({
        features: features
      });
    }

    // Cancel the workflow so that once edits are applied, a new popup can be displayed
    editor.viewModel.cancelWorkflow();
  });

  // view.popup.spinnerEnabled = false;
  //

  // Add widget to top-right of the view
  // view.ui.add(editor, 'manual');

  return {
    editor: editor,
    clear: () => {
      view.ui.remove(editor);
    },
  };
}

// http://g.com/esri/v415_sdk/latest/api-reference/esri-layers-support-CodedValueDomain.html
// 字典值

/// CodedValueDomain

/*

   featureLayer.fields.forEach(function(field){
        if (field.domain){
          var domain = field.domain
          console.log(field.name, domain.type, domain.name);
          if (domain.type === "coded-value"){
            domain.codedValues.forEach(function(codeValue){
              console.log("name:", codeValue.name, "code:", codeValue.code);
            });
          }
        }
      });
 

*/


```



/*
 
addRing()	Polygon	Adds a ring to the Polygon.more details	Polygon
clone()	Polygon	Creates a deep clone of Polygon object.more details	Polygon
contains()	Boolean	Checks on the client if the input point is inside the polygon.more details	Polygon
fromExtent()	Polygon	Converts the given Extent to a Polygon instance.more details	Polygon
fromJSON()	
getPoint()	Point	Returns a point specified by a ring and point in the path.more details	Polygon
insertPoint()	Polygon	Inserts a new point into the polygon.more details	Polygon
isClockwise()	Boolean	Checks if a Polygon ring is clockwise.more details	Polygon
removePoint()	Point[]	Removes a point from the polygon at the given pointIndex
removeRing()	Point[]	Removes a ring from the Polygon.more details	Polygon
setPoint()	Polygon	Updates a point in the polygon.more details	Polygon
toJSON()

只有 centroid
isSelfIntersecting: 判断是否是自相交 

// todo Polygon - Property - 属性
cache	Object	The cache is used to store values computed from geometries that need to cleared or recomputed upon mutation.more details	Geometry
centroid	Point	The centroid of the polygon.more details	Polygon
declaredClass	String	The name of the class.more details	Accessor
extent	Extent	The extent of the geometry.more details	Geometry
hasM	Boolean	Indicates if the geometry has M values.more details	Geometry
hasZ	Boolean	Indicates if the geometry has z-values (elevation).more details	Geometry
isSelfIntersecting	Boolean	Checks to see if polygon rings cross each other and indicates if the polygon is self-intersecting, which means the ring of the polygon crosses itself.more details	Polygon
rings	Number[][][]	An array of rings.more details	Polygon
spatialReference	SpatialReference	The spatial reference of the geometry.more details	Geometry
type	String	The string value representing the type of geometry.more details	Polygon

*/

/*
// todo  Polyline
addPath()	Polyline	Adds a path, or line segment, to the polyline.more details	Polyline
clone()	Polyline	Creates a deep clone of Polyline object.more details	Polyline
fromJSON()
getPoint()	Point	Returns a point specified by a path and point in the path.more details	Polyline
insertPoint()	Polyline	Inserts a new point into a polyline.more details	Polyline
removePath()	Point[]	Removes a path from the Polyline.more details	Polyline
removePoint()	Point	Removes a point from the polyline at the given pointIndex 
setPoint()	Polyline	Updates a point in a polyline.more details	Polyline
toJSON()	
*/
