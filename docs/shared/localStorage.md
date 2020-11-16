`当同源页面的某个页面修改了localStorage,其余的同源页面只要注册了storage事件，就会触发`

localStorage 的例子运行需要如下条件：
1. 同一浏览器打开了两个同源页面
1. 其中一个网页修改了localStorage
1. 另一网页注册了storage事件


`在同一个网页修改本地存储，又在同一个网页监听，这样是没有效果的。`
页面A
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <title>A</title>
</head>
<body>
<script>
    window.addEventListener("storage", function (e) {
        alert(e.newValue);
    });
</script>
</body>
</html>
```

页面B
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <title>B</title>
</head>
<body>
<script>
    localStorage.clear();
    localStorage.setItem('foo', 'bar');
</script>
</body>
</html>
```



如果非得要在同一网页监听怎么办？可以重写localStorage的方法，抛出自定义事件：

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <title>A</title>
</head>
<body>
<script>
    var orignalSetItem = localStorage.setItem;
    localStorage.setItem = function(key,newValue){
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        window.dispatchEvent(setItemEvent);
        orignalSetItem.apply(this,arguments);
    }
    window.addEventListener("setItemEvent", function (e) {
        alert(e.newValue);
    });
    localStorage.setItem("nm","1234");
</script>
</body>
</html>
```