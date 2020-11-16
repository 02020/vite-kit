```ts
   //解析分类样式
    getClassifyData () {
      let vm = this
      vm.classifyData = [];
      vm.lastClassifyLabel = vm.classifyLabel;
      let clissifySymbols = vm.shapeInfo.symbol.complexSymbol.uniqueValueInfos;
      if (vm.lastClassifyLabel != undefined && vm.lastClassifyLabel != "" && clissifySymbols != undefined) {
        let classify = vm.classifyDataHistory.find(item => item.id == vm.shapeInfo.id && item.key == vm.classifyLabel);
        if (classify != undefined) {
          vm.classifyData = classify.data;
        } else {
          vm.setClassifytSymbol(DEFAUTL_NAME, true);
          let filedValues = vm.readFieldValue(vm.lastClassifyLabel);
          filedValues.forEach(function (value) {
            let classifySymbol = clissifySymbols.find(function (classify) {
              return classify.value != undefined && value == classify.value
            });
            vm.setClassifytSymbol(value, classifySymbol != undefined, undefined, classifySymbol);
          })
        }
      }
    },
 
   setClassifytSymbol (key, isCustom, geoType, classifySymbol) {
      let vm = this;
      let data = {};
      data.key = key;
      data.isCustom = isCustom == undefined ? false : isCustom;
      data.geoType = geoType == undefined ? vm.shapeInfo.geoType : geoType;
      data.symbol = classifySymbol == undefined || classifySymbol.symbol == undefined ? vm.shapeInfo.symbol.complexSymbol.defaultSymbol : classifySymbol.symbol;
      vm.classifyData.push(data);
    },

 

    //读取字段所有值
    readFieldValue (field) {
      let vm = this
      let values = [];
      vm.shapeInfo.records.forEach(function (record) {
        let value = record.attributes[field];
        if (value != undefined) {
          if (!values.includes(value)) {
            values.push(value)
          }
        }
      })
      return values;
    },
    /**
     * 判断field是否在fields中
     */
    checkFieldExist (fields, field) {
      if (fields.findIndex(_field => _field.value == field) >= 0) {
        return field;
      } else {
        return "";
      }
    },

        addClassifyDataHistory () {
      let vm = this
      if (vm.lastClassifyLabel != undefined && vm.lastClassifyLabel != "") {
        let index = vm.classifyDataHistory.findIndex(item => item.id == vm.shapeInfo.id && item.key == vm.lastClassifyLabel);
        if (index >= 0) {
          vm.classifyDataHistory.splice(index, 1);
        }
        vm.classifyDataHistory.push({
          id: vm.shapeInfo.id, //shapeInfo 标识
          key: vm.lastClassifyLabel, //字段标识
          data: vm.classifyData
        })
      }
    },
```