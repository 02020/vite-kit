const s = [



 {
    type: 'map-image',
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer",
    sublayers: [
      {
        id: 10,
        renderer: {
          type: "class-breaks"
          // set other renderer properties in this object
        },
        source: {
          mapLayerId: 1
        }
      },
      {
        id: 11,
        renderer: {
          type: "unique-value"
          // set other renderer properties in this object
        },
        definitionExpression: "POP07_SQMI >= 5100",
        source: {
          mapLayerId: 1
        }
      },
      {
        id: 12,
        renderer: {
          type: "simple"
          // set other renderer properties in this object
        },
        definitionExpression: "POP07_SQMI >= 5100",
        source: {
          mapLayerId: 1
        }
      }
    ]

  }]
