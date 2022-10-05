---
title: 布局和包含块
icon: any
index: false
article: false
---

::: info
原文链接：[布局和包含块 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block)
:::


一个元素的尺寸和位置经常受其**包含块** (containing block)的影响。大多数情况下，包含块就是这个元素最近的祖先块元素的内容区，但也不是总是这样。在本文中，我们来过一遍确定包含块的所有因素。

当一个客户端代理（比如说浏览器）展示一个文档的时候，对于每一个元素，它都产生了一个盒子。每一个盒子都被划分为四个区域：

- 内容区
- 内边距区
- 边框区
- 外边距区

![](http://timpcfan-site.cdn.bcebos.com/imgs/vFXIfB.jpg)

::: info
一个元素的包含块==不一定是他的父元素的内容区==。
:::

## 包含块的影响

元素的尺寸及位置，常常会受它的包含块所影响。对于一些属性，例如 `width`, `height`, `padding`, `margin`，绝对定位元素的偏移值（比如 `position` 被设置为 `absolute` 或 `fixed`），当我们对其赋予百分比值时，这些值的计算值，就是通过元素的包含块计算得来。

## 确定元素包含块的因素都有哪些

确定一个元素的包含块的过程完全依赖于这个元素的 `position` 属性：

1. 如果 `position` 属性为 `static`、`relative` 或 `sticky`，包含块可能由它的最近的祖先块元素（比如说 `inline-block`, `block` 或 `list-item` 元素）的内容区的边缘组成，也可能会建立格式化上下文 (比如说 a table container, flex container, grid container, 或者是 the block container 自身)。
1. 如果 `position` 属性为 `absolute` ，包含块就是由它的最近的 `position` 的值不是 `static` （也就是值为`fixed`, `absolute`, `relative` 或 `sticky`）的祖先元素的内边距区的边缘组成。
1. 如果 `position` 属性是 `fixed`，在连续媒体的情况下 (continuous media) 包含块是 viewport ,在分页媒体 (paged media) 下的情况下包含块是分页区域 (page area)。
1. 如果 `position` 属性是 `absolute` 或 `fixed`，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：
   - `transform` 或 `perspective` 的值不是 `none`
   - `will-change` 的值是 `transform` 或 `perspective`
   - `filter` 的值不是 `none` 或 `will-change` 的值是 `filter`(只在 Firefox 下生效).
   - `contain` 的值是 `paint` (例如：`contain: paint;`) （🌟 这个很好用）

:::details contain 属性
[CSS **contain** 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain)允许开发者声明当前元素和它的内容尽可能的*独立于* DOM 树的其他部分。这使得浏览器在重新计算布局、样式、绘图、大小或这四项的组合时，只影响到有限的 DOM 区域，而不是整个页面，可以有效改善性能。

这个属性在包含大量独立组件的页面非常实用，它可以防止某个小部件的 CSS 规则改变对页面上的其他东西造成影响。
:::

:::info 
根元素 (`<html>`) 所在的包含块是一个被称为初始包含块的矩形。他的尺寸是视口 viewport (for continuous media) 或分页媒体 page media (for paged media).
:::

## 根据包含块计算百分值
如上所述，如果某些属性被赋予一个百分值的话，它的计算值是由这个元素的包含块计算而来的。这些属性包括盒模型属性和偏移属性：

1. 要计算 `height`, `top` 及 `bottom` 中的百分值，是通过包含块的 `height` 的值。如果包含块的 `height` 值会根据它的内容变化，而且包含块的 `position` 属性的值被赋予 `relative` 或 `static` ，那么，这些值的计算值为 `auto`。
1. 要计算 `width`, `left`, `right`, `padding`, `margin` 这些属性由包含块的 `width` 属性的值来计算它的百分值。

