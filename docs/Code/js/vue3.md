```ts
import { defineComponent } from 'vue';

export default defineComponent({
  setup (
    props: object,
    { attrs, emit } 
  ) {
    return { attrs, emit }
  },
  render (props: { attrs: { name: string }; emit: Function }) {
    return (
      <div
        onClick={() => {
          console.log("object");
          props.emit('updateName')
        }}
      >
        hello {props.attrs.name}
      </div>
    )
  }
})
```
