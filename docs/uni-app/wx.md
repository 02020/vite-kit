# 微信

[公众号 sdk](https://developers.weixin.qq.com/doc/offiaccount/Non_tax_pay/API_document.html)

## 环境配置

### [公众号](https://mp.weixin.qq.com/)
公众号设置->功能设置->[JS接口安全域名,网页授权域名]
安全中心->IP白名单: 110.87.82.193

### [微信支付](https://pay.weixin.qq.com/)
暂...


### 内网穿透

网址: wxgis.cn.utools.club
iP: 106.54.98.19

## 微信消息

[普通消息](https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_standard_messages.html)

## 微信支付

[微信支付](https://pay.weixin.qq.com/wiki/doc/api/index.html)
[开发步骤](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3)

测试

## JAVA

[WxJava](https://github.com/Wechat-Group/WxJava)

### 引包

wx-java-pay-spring-boot-starter
weixin-java-pay

[定位](https://developers.weixin.qq.com/doc/offiaccount/User_Management/Gets_a_users_location.html)



## UI
[](https://github.com/GitHubGanKai/vue3-jd-h5)





### 响应体

```JSON
{"type":"object","data":{"openid":"o5ONe6JgxK79SuxAK5-R70e-Gq4Q","nickname":"二少","sex":1,"city":"厦门","province":"福建","country":"中国","headImgUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epiaGekBsXialUfHvq7zvhDoPaygwgFZicAgaXOKS74suQP6PKNLTQO4A2bOo6iaXd58UicSPicN4KEXD9Q/132","unionId":null,"privileges":[]}}
```

四维科图 appID: wxeb76350761228a9f


```ts
{
  appId: 'wxeb76350761228a9f';
  nonceStr: '6ewWJNagFZz2ocGb';
  packageValue: 'prepay_id=wx14153428246717c6578b769d9e01fc0000';
  paySign: '4C00646F4A956E54AAC44F9D09797A3E';
  signType: 'MD5';
  timeStamp: '1610609668';
}
```

```ts
const params = {};
const success = (res) => {
  console.log('成功', res);
};
const fail = ({ success, message }) => {
  this.$u.toast(message);
  console.error(message);
};
this.$u.api('createOrder', params, success, fail);
```

```ts
this.$jwx.wxpay({
  data: {
    nonceStr: '6ewWJNagFZz2ocGb',
    package: 'prepay_id=wx14153428246717c6578b769d9e01fc0000',
    paySign: '4C00646F4A956E54AAC44F9D09797A3E',
    signType: 'MD5',
    timeStamp: '1610609668',
  },
});
```
