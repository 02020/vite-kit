export const setting = {
  container: 'viewMap',
  widgets: {},
  layerList: [],
  tileInfo: true,
};

export const init92 = {
  zoom: 6,
  tileInfo: false,
  center: '55555,5000', // 不起作用，需要手动定位
  extent: '36920.6636,-2179.8415,93151.5846,56361.4883',
  wkid: 4490,
  wkt:
    'PROJCS["92xiamen",GEOGCS["GCS_Krasovsky_1940",DATUM["D_Krasovsky_1940",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",100000.0],PARAMETER["False_Northing",-2700000.0],PARAMETER["Central_Meridian",118.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
};

// 只加载厦门
export const init2000 = {
  zoom: 5,
  center: '118.06,24.444',
  extent: '',
  wkid: 4490,
  country: 0, // 不加载国家的服务
};

// 只加载国家
export const init2000Country = {
  zoom: 14,
  center: '118.06,24.444',
  wkid: 4326, // 只加载国家的必须采用4326
  country: 'DLG',
};

// 国家与厦门
export const init2000CountryXM = {
  zoom: 14,
  center: '118.06,24.444',
  wkid: 4490,
  country: 'DOM',
};
// 弹窗配置
export const popup = {
  // defaultPopupTemplateEnabled:true,
  actions: [],
  dockEnabled: false,
  dockOptions: {
    // Disables the dock button from the popup
    buttonEnabled: false,
    // Ignore the default sizes that trigger responsive docking
    breakpoint: false,
  },
  autoCloseEnabled: true,
  spinnerEnabled: true,
  highlightEnabled: false,

  alignment: 'top-right',
};
