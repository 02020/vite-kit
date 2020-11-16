```ts

/**
 * 唯一ID生成器
 * @param {*} prefix
 */
function getUid(prefix) {
    prefix = prefix || 'wgid_';

    return (
        prefix +
        'xxyxxyxx'.replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0;
            let v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
    );
}

```

### is
```ts

/**
 * 是否数组
 * @param {*} o
 */
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

/**
 * 是否对象
 * @param {*} o
 */
function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

/**
 * 是否数值
 * @param {*} o
 */
function isNumber(o) {
    return Object.prototype.toString.call(o) === '[object Number]';
}

/**
 * 是否字符串
 * @param {*} o
 */
function isString(o) {
    return Object.prototype.toString.call(o) === '[object String]';
}

/**
 * 是否已定义
 * @param {*} o
 */
function isDefined(o) {
    return o !== undefined && o !== null;
}
```