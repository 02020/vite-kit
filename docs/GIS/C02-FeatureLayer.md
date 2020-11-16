
# GIS 实例

 <gis-featureLayerEditor />

<Code>
 <<< docs\.vitepress\components\GIS\C01.FeatureLayerEditor.vue
</Code>
 


## 构造函数
new FeatureLayerEditor(id, fieldConfig)

### Parameter 入参
| 名称        | 类型   | 说明     | 示例 |
| ----------- | ------ | -------- | ---- |
| id          | String | 图层ID   |      |
| fieldConfig | Array  | 字段配置 |      |
 

## 属性
| 名称   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| editor | esri对象 | [Editor](http://www.ztgis.com:8868/arcgis_js_api/library/4.15/sdk/latest/api-reference/esri-widgets-Editor.html) | -      | -      |

 
## 方法
| 方法名 | 说明   | 入参 |
| ------ | ------ | ---- |
| clear  | 清除UI | -    |



### 测试数据

#### 地图服务地址

`http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/1`

`http://222.76.242.138/arcgis/rest/services/YSHJ/CZZSZD/MapServer/0`

`http://222.76.242.138/arcgis/rest/services/ZTT/KZD/FeatureServer/0`

`http://222.76.242.138/arcgis/rest/services/XM92/XZQH/MapServer/0`


#### layer数据结构
```ts
{
  id: 'edit',
  type: 'feature',
  url: 'http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/1',
},
```

#### fieldConfig 字段配置的数据结构
```ts
 let fieldConfig = [{
  name: 'MC',
  label: '我是中文MC',
  visible: false,
  editorType: 'text-box', // 'text-area'
  hint: 'hint 的属性', // 鼠标移入是的小弹窗
  maxLength: -1, // 默认值
  minLength: -1, // 默认值
  domain: [
    { name: '宗地1', code: '01' },
    { name: '宗地2', code: '02' },
  ],
},{
  name: 'DLFW',
  label: '我是中文DLFW',
  hint: 'hint 的属性',
}]
gis.widthEditor('edit', fieldConfig)
```


### 参考资料
[CodedValueDomain-字典值](http://g.com/esri/v415_sdk/latest/api-reference/esri-layers-support-CodedValueDomain.html)
 

featureLayer代码暂存
 ``` ts
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
 ```