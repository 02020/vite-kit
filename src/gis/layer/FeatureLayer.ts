/** @format */

import { modules } from '../core';
import { isString, toNumber } from '../../shared';

export function FeatureLayerEditor(
  view: __esri.MapView,
  featureLayer: __esri.FeatureLayer,
  fields: Array<any>
) {
  // console.log('  featureLayer.isFulfilled()', featureLayer.isFulfilled());
  // console.log('  featureLayer.isRejected()', featureLayer.isRejected());
  // console.log('  featureLayer.isResolved()', featureLayer.isResolved());

 
  if (featureLayer.isFulfilled()) {
    // console.error('featureLayer图层未加载成功', featureLayer);
    // throw new Error('featureLayer图层未加载');
  }

  fields.forEach((f) => {
    let t = featureLayer.getField(f.name);
    if (!t) throw new Error(`字段配置错误:${f.name}`);
  });

  const fieldConfig: __esri.FieldConfig[] = [];

  fields.forEach((element) => {
    let { domain, visible, editorType, hint } = element;
    let field = new modules.FieldConfig({ editorType, hint });

    field.name = element.name.trim();
    element.minLength && (field.minLength = toNumber(element.minLength));
    element.maxLength && (field.maxLength = toNumber(element.maxLength));
    visible = visible == 'true' ? true : visible == 'false' ? false : visible;
    const codedValues = isString(domain) ? JSON.parse(domain) : domain;

    if (visible) {
      if (codedValues.length) {
        field.domain = new modules.CodedValueDomain({
          type: 'coded-value',
          name: name,
          codedValues: codedValues,
        });
      }
      // return field;
      fieldConfig.push(field);
    }
  });

  // console.log('field', fieldConfig);

  let editConfigPoliceLayer: __esri.LayerInfo = {
    layer: featureLayer,
    fieldConfig,
  };

  let editor = new modules.Editor({
    view: view,
    layerInfos: [editConfigPoliceLayer],
  });

  // view.popup.spinnerEnabled = false;
  //

  // Add widget to top-right of the view
  view.ui.add(editor, 'manual');

  return {
    editor: editor,
    clear: () => {
      editor.viewModel.cancelWorkflow();
      view.ui.remove(editor);
    },
  };
}
