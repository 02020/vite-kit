# call
```ts
const call = (key, ...args) => context => context[key](...args);

// demo1
const fn = call('map', (x) => 2 * x);
fn([1, 2, 3]);   // -> [1, 2, 3].map((x) => x * 2);

// demo2
class Test {
  constructor() { }
  request (x, y) {
    console.log(x, y);
  }
}

const fn1 = call('request', (x) => 2 * x, 'request');

fn1(new Test());  // -> new Test().request((x) => 2 * x, 'request')

```


onEventHandler 


### Date
```ts
var m = new Date();
var n = new Date(m.getTime() + 1000 * 60);
```