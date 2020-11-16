<!-- @format -->

```ts
function fetchRoomData(roomId, connectionId) {
  return $.ajax({
    url: webUrl.roomData,
    data: {
      roomId: roomId,
      connectionId: connectionId,
    },
    type: 'get',
    dataType: 'json',
  });
}

//var systemTime = $.ajax({ url: webUrl.index, type: 'HEAD', async: false }).getResponseHeader("Date"),

//接口测试
var para = { token: 'tokenZPG', docId: '10130498' };
$.ajax({
  url: 'http://127.0.0.1:19462/api.asmx/GetDocument',
  data: {
    para: JSON.stringify(para),
  },
  type: 'get',
  dataType: 'json',
}).then(
  function (resp) {
    console.log('$.ajax', resp);
  },
  function (resp) {
    console.log('$.ajax', resp);
  }
);

//请求
ajax = function (url, data) {
  var vm = this;
  return $.ajax({
    url: url,
    data: data,
    type: 'post',
    dataType: 'json',
    complete: function () {
      vm.fullscreenLoading = false;
    },
  });
};
```
