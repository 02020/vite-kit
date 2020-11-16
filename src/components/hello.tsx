/** @format */

import {
  reactive,
  vShow,
  vModelText,
  toRefs,
  withDirectives,
  App,
  isReadonly,
} from 'vue';

interface Props {
  number: number;
  $slots: {
    desc: () => any[];
  };
  desc: () => {};
  input: any;
  visible: boolean;
  test: string;
}

const install = (app: App) => {
  app.component('myInput', {
    props: {
      number: {
        type: String,
      },
      test: {
        type: String,
      },
      visible: { type: Boolean },
    },
    setup(props: Props, { slots }) {
      console.log('setup', props);
      const state = reactive({ input: 0, isShow: false });
      return { ...toRefs(slots), ...toRefs(state) };
    },

    render(props: Props) {
      const { visible } = this;
      console.log('render', this);
 
      return (
        <div>
          <div v-show={visible}>你看不见我</div>
          {props.desc()}
          {withDirectives(<input type="text" class="bg-orange-400" />, [
            [vModelText, this.number],
          ])}
          <div>{this.number}</div>
          {withDirectives(<h1>Count: 2</h1>, [[vShow, props.visible]])}
        </div>
      );
    },
  });
};

export default {
  install,
};

