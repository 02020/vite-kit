<template>
  <div class="code">
    <div class="code--title">
      <h2></h2>
      <small> </small>
    </div>
    <div v-if="isShow"
         class="code--demo">
     
        <slot></slot>
 
    </div>

    <div class="code--button">
      <div @click="handleToggleShow"
           class="code--show">
        {{codeTextBtn}}
      </div>
      <div v-if="onlineLink"
           class="code--online"
           @click="handleOnline">
        {{codeTextBtnOnline}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    onlineLink: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: false,
      codeTextBtn: '显示代码',
      codeTextBtnOnline: '在线运行'
    }
  },
  methods: {
    handleToggleShow () {
      this.isShow = !this.isShow
      this.codeTextBtn = this.isShow ? '隐藏代码' : '显示代码'
    },
    handleOnline () {
      window.open(this.onlineLink)
    }
  }
}
</script>

<style  >
.code {
  padding: 0px 0;
}
 
.code--title h2 {
  padding: 0;
  margin: 0;
  border-bottom: none;
  font-size: 18px;
}

.code--title small {
  font-size: 14px;
  display: inline-block;
  margin: 10px 0;
  color: #5e6d82;
}

.code--demo { 
  border-bottom: none;
  border-radius: 3px;
  box-shadow: 0 0 2px 0 rgba(232, 237, 250, 0.6),
    0 1px 2px 0 rgba(232, 237, 250, 0.5);
}
 
.code--button {
  position: relative;
  background: #fafbfc;
  color: #409eff;
  font-weight: 400;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.code--button .code--show {
  display: flex;
  justify-content: center;
}
.code--button .code--show:hover {
  font-size: 17px;
}
.code--button .code--online {
  position: absolute;
  top: 0;
  right: 0;
  padding-left: 5px;
  padding-right: 25px;
}
.code--button .code--online:hover {
  font-size: 17px;
}
</style>
