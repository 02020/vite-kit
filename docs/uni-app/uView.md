 
## template
```html
    <template v-slot:label>
      <span>{{ label }}</span>
      <span v-if="tooltip"> </span>
    </template>
```


## form

### u-form-item
```html
<u-form-item
  :leftIconStyle="{ color: '#888', fontSize: '32rpx' }"
  left-icon="account"
  label-width="120"
  :label-position="labelPosition"
  label="姓名"
  prop="name"
> </u-form-item>
```

### u-input
```html
<u-input type="text" :border="border" placeholder="请输入姓名" v-model="model.name"></u-input>

<u-input type="number" :border="border" placeholder="请输入手机号" v-model="model.phone"></u-input>

<!--  -->
<u-input type="textarea" :border="border" placeholder="请填写简介" v-model="model.intro" />

<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="model.sex" placeholder="请选择性别" @click="actionSheetShow = true"></u-input>

<u-input :border="border" type="select" :select-open="pickerShow" v-model="model.region" placeholder="请选择地区" @click="pickerShow = true"></u-input>

<u-input :border="border" type="select" :select-open="selectShow" v-model="model.goodsType" placeholder="请选择商品类型" @click="selectShow = true"></u-input>
 
```

#### 验证码
```html
<u-form-item :label-position="labelPosition" label="验证码" prop="code" label-width="150">
  <u-input :border="border" placeholder="请输入验证码" v-model="model.code" type="text"></u-input>
  <u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
</u-form-item>
```

#### 密码
```html
<u-form-item :label-position="labelPosition" label="密码" prop="password">
  <u-input :password-icon="true" :border="border" type="password" v-model="model.password" placeholder="请输入密码"></u-input>
</u-form-item>
<u-form-item :label-position="labelPosition" label="确认密码" label-width="150" prop="rePassword">
  <u-input :border="border" type="password" v-model="model.rePassword" placeholder="请确认密码"></u-input>
</u-form-item>
```


### checkbox-group
```html
<u-checkbox-group @change="checkboxGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
  <u-checkbox v-model="item.checked" v-for="(item, index) in checkboxList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
</u-checkbox-group>

```

### radio-group
```html
<u-radio-group v-model="radio" @change="radioGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
  <u-radio shape="circle" v-for="(item, index) in radioList" :key="index" :name="item.name">{{ item.name }}</u-radio>
</u-radio-group>
```

### switch
```html
<!-- 此处switch的slot为right，如果不填写slot名，也即<u-switch v-model="model.remember"></u-switch>，将会左对齐 -->
<u-switch v-model="model.remember" slot="right"></u-switch>
```



### 下拉框
[actionSheet](https://www.uviewui.com/components/actionSheet.html)
[section](https://www.uviewui.com/components/section.html)
```html
<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>

<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>

<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm"></u-picker>

```


```html
<view class="agreement">
  <u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
  <view class="agreement-text"> 勾选代表同意uView的版权协议 </view>
</view>


<style scoped lang="scss">
.agreement {
  display: flex;
  align-items: center;
  margin: 40rpx 0;

  .agreement-text {
    padding-left: 8rpx;
    color: $u-tips-color;
  }
}
</style>
```