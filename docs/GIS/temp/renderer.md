```ts

   renderer = new modules.SimpleRenderer({
    symbol,
  })


  let renderer = new modules.ClassBreaksRenderer({
    field: 'BSM',
    defaultSymbol:symbol,
    classBreakInfos: [{ minValue: 0, maxValue: 4.0, symbol: symbol2 }],
  });

  renderer.addClassBreakInfo({
    minValue: 0,
    maxValue: 4.0,
    symbol,
  });


  symbol = {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    color: [255, 128, 0, 0.5],
    outline: {
      // autocasts as new SimpleLineSymbol()
      width: 1,
      color: 'white',
    },
  };


const fwySym = {
    type: "simple-line", // autocasts as new SimpleLineSymbol()
    color: "#30ffea",
    width: "0.5px",
    style: "solid"
  };

  // Symbol for U.S. Highways
  const hwySym = {
    type: "simple-line", // autocasts as new SimpleLineSymbol()
    color: "#ff6207",
    width: "0.5px",
    style: "solid"
  };

  // Symbol for other major highways
  const otherSym = {
    type: "simple-line", // autocasts as new SimpleLineSymbol()
    color: "#ef37ac",
    width: "0.5px",
    style: "solid"
  };




  const hwyRenderer = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    legendOptions: {
      title: "Freeway type"
    },
    defaultSymbol: otherSym,
    defaultLabel: "State Highway",
    field: "CLASID",
    uniqueValueInfos: [
      {
        value: "670500", // code for interstates/freeways
        symbol: fwySym,
        label: "Interstate"
      },
      {
        value: 670500, // code for U.S. highways
        symbol: hwySym,
        label: "US Highway"
      }
    ]
  };



```