## 标绘流程
1. Sketch 初始化
2. 激活图形绘制
3. 图形创建完成后 执行回调
4. 点击图形->打开弹窗
5. 填写表单->保存->分发给父组件
6. 父组件接收save事件->更新图形属性
7. over

dom 弹窗组件

组件间的层级

入参

```ts

// "srCode": "cgcs2000","xiamen92"
//取值范围：xiamen92，cgcs2000，说明：xiamen92为小92坐标系
const demo92 = {
  url: '',
  extent: '36920.6636,-2179.8415,93151.5846,56361.4883',
};

const demo2000 = {
  url: '',
  extent: '36920.6636,-2179.8415,93151.5846,56361.4883',
  country: 'DOM',
};

```



```ts
/**
 * 简易判断是不是厦门范围内的经纬度
 * @param {*} x 经度
 * @param {*} y 纬度
 */
export const isLatAndLog = (x, y) => {
  return x.toString().indexOf(".") == 3 && y.toString().indexOf(".") == 2;
}


    
```