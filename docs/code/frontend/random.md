---
title: 前端开发 HowTo
icon: any
order: -1
article: false
---


## 如何批量添加iconfont图标 [^1]

[^1]: [iconfont批量添加图标到购物车](http://yangjunwei.com/4070.html)

在 Iconfont 浏览图标页面时，在浏览器控制台使用下列代码即可全部添加。

```js
var icons = document.querySelectorAll('.icon-gouwuche1');
var auto_click = function(i) {
    if (i < icons.length) {
            icons.item(i).click();
            auto_click(i + 1);
    }
};
auto_click(0);
```

## 如何自动更新iconfont图标 

[https://juejin.cn/post/7033842853021220900](https://juejin.cn/post/7033842853021220900)
