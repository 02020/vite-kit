```html
<template>
  <u-form-item :size="size" :required="isRequired" :error="errors[0]">

    <template v-if="isSelect">
      <u-input
        :border="border"
        type="select"
        :select-open="selectShow"
        :value="localValue"
        v-bind="props"
        @click="selectShow = true"
      ></u-input>
    </template>
    <template v-else-if="code">
      <u-input
        :border="border"
        placeholder="请输入验证码"
        :value="localValue"
        type="text"
      ></u-input>
      <u-button
        slot="right"
        type="success"
        size="mini"
        @click="updateLocalValue"
        >{{ localValue }}</u-button
      >
    </template>

    <template
      v-else-if="isRadio"
      :is="component"
      v-bind="props"
      :value="localValue"
      @input="updateLocalValue"
    >
      <u-radio v-for="item in items" :key="item.value" :label="item.value">
        {{ item.text }}
      </u-radio>
    </template>
    <template
      v-else-if="isCheckbox"
      :is="component"
      v-bind="props"
      :value="localValue"
      @input="updateLocalValue"
    >
      <u-checkbox v-for="item in items" :key="item.value" :label="item.value">
        {{ item.text }}
      </u-checkbox>
    </template>

    <template v-else>
      <u-input :type="type" :border="border" :placeholder="placeholder" v-model="model.phone"></u-input>
    </template>

    <u-select
      mode="single-column"
      :list="selectList"
      v-model="selectShow"
      @confirm="selectConfirm"
    ></u-select>
    <u-picker
      mode="region"
      v-model="pickerShow"
      @confirm="regionConfirm"
    ></u-picker>


    
  </u-form-item>
</template>

<style lang="scss">
.el-form-item__tip {
  font-size: 12px;
  line-height: 12px;
  padding: 10px 0 5px 0;
  color: #737373;
}
</style>

<script>
import { useFormElement } from '@fext/vue-use'

export default {
  name: 'el-form-adaptor',

  props: {
  
    name: String,
    size: {
      type: String,
      default: 'medium',
    },
    label: String,
    rules: {
      type: [String, Object],
    },
    value: {
      required: false,
    },
    props: {
      type: Object,
      default() {
        return {}
      },
      required: false,
    },
    items: {
      type: Array,
      default() {
        return []
      },
      required: false,
    },
    extend: {
      type: Object,
      default() {
        return {}
      },
    },
    metadata: {
      type: Object,
      default() {
        return {}
      },
    },
    formValues: {
      type: Object,
      required: false,
    },
  },

  setup(props, context) {
    const {
      dirty,
      isRequired,
      localValue,
      setInitialValue,
      updateLocalValue,
    } = useFormElement(props, context)
    return {
      dirty,
      isRequired,
      localValue,
      setInitialValue,
      updateLocalValue,
    }
  },

  data() {
    return {}
  },

  computed: {
    component() {
      return this.extend.component || 'u-input'
    },

    isSelect() {
      return this.component === 'u-select'
    },

    isMultipleSelect() {
      return this.isSelect && this.props.multiple
    },

    isRadio() {
      return this.component === 'u-radio-group'
    },

    isCheckbox() {
      return this.component === 'u-checkbox-group'
    },
  },

  created() {
    const { localValue, isMultipleSelect, isCheckbox } = this

    if (localValue == null) {
      if (isMultipleSelect || isCheckbox) {
        this.setInitialValue([])
      }
    }
  },
}
</script>


``