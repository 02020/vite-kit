# dds

## dd

### 弹窗

```ts
uni.showToast({
  title: '点击了悬浮按钮',
  icon: 'none',
});

```


```html
    <view class="uni-fab uni-fab--leftBottom" v-show="visibleTip">
      <view
        class="uni-fab__circle uni-fab__plus uni-fab__circle--leftBottom"
        @click="onClickLeftBottom"
        >开始
      </view>
    </view>

```