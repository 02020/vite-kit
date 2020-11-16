# Senparc.Weixin

## 2

### 3

#### 发送图文消息

```cs
List<Article> articles = new List<Article>();
articles.Add(new Article()
{
    Title = "哈哈哈",
    Description = "测试数据",
    Url = "https://www.baidu.com",
    PicUrl = "https://www.baidu.com/img/flexible/logo/pc/result.png"  //图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80
});

string accessTokenOrAppId = wx.Config.SenparcWeixinSetting.WeixinAppId;//与微信公众账号后台的AppId设置保持一致，区分大小写。
string openId = "o88sg6FP1MWIvucK3BEBWCnysKUw";

CustomApi.SendNews(accessTokenOrAppId, openId, articles);  //发送图文消息（点击跳转到外链）

```

#### 发送模板消息
调用API
```cs
string accessTokenOrAppId = wx.Config.SenparcWeixinSetting.WeixinAppId;//与微信公众账号后台的AppId设置保持一致，区分大小写。
string openId = "o88sg6FP1MWIvucK3BEBWCnysKUw";

//CustomApi.SendNews(accessTokenOrAppId, openId, articles);  //发送图文消息（点击跳转到外链）

var testData = new //TestTemplateData()
{
    first = new TemplateDataItem("【异步模板消息测试】"),
    keyword1 = new TemplateDataItem(openId),
    keyword2 = new TemplateDataItem("网页测试"),
    keyword3 = new TemplateDataItem(SystemTime.Now.LocalDateTime.ToString()),
    remark = new TemplateDataItem("更详细信息，请到Senparc.Weixin SDK官方网站（https://sdk.weixin.senparc.com）查看！\r\n\r\n这里我做了两个换行！\r\n\r\n点击详情可跳转到 BookHelper 小程序！")
};
TemplateApi.SendTemplateMessage(
    accessTokenOrAppId, openId,
    "23Rrww_MPl2tCWFRKe2v5cIOJ5i7zKXDOJqtjBi1luA",
  "https://www.baidu.com", testData);
```


封装后
```cs
var model = new BusinessTemplateMessage()
{
    First = "头部",
    Remark = "尾部",
    Url= "https://www.baidu.com",
    keyword1 = "111",
    keyword2 = "111",
    keyword3 = "111",
    UserId = "o88sg6FP1MWIvucK3BEBWCnysKUw"
};
model.Send();
```