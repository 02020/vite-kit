```ts
/**
 * 键值对：字段=>字段值
 */
var m1 = new Map();

/**
 * 键值对：字段=>字段名称
 */
var m2 = new Map();

/**
 * 键值对：字段名称 => 字段值
 */
var m3 = new Map();

m1.set('字段', '字段值');
m1.set('a2', 'aa2');

m2.set('字段', '字段名称');
m2.set('b2', 'bb2');

m1.forEach((v, k) => {
  m3.set(m2.get(k), v);
});

// { '字段名称' => '字段值', undefined => 'aa2' }
console.log(m3);

```