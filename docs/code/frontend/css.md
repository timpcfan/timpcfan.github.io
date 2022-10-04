---
title: CSS 笔记
order: 5
icon: css
category:
  - 笔记
  - 前端
tag:
  - 前端
  - CSS
---

::: info
整理了一些学习 CSS 时的笔记。
:::

## CSS 选择器

| 选择器 | 示例 | 示例说明 | CSS |
| --- | --- | --- | --- |
| .class | .intro | 选择所有class="intro"的元素 | 1 |
| #id | #firstname | 选择所有id="firstname"的元素 | 1 |
| * | * | 选择所有元素 | 2 |
| element | p | 选择所有`<p>`元素 | 1 |
| element,element | div,p | 选择所有`<div>`元素和`<p>`元素 | 1 |
| element element | div p | 选择`<div>`元素内的所有`<p>`元素 | 1 |
| element>element | div>p | 选择所有父级是 `<div>` 元素的 `<p>` 元素（div的直接儿子，不包含孙子） | 2 |
| element+element | div+p | 选择所有紧跟在 `<div>` 元素之后的第一个 `<p>` 元素 | 2 |
| [attribute] | [target] | 选择所有带有target属性元素 | 2 |
| [attribute=value] | [target=-blank] | 选择所有使用target="-blank"的元素 | 2 |
| [attribute~=value] | [title~=flower] | 选择标题属性包含单词"flower"的所有元素 | 2 |
| [attribute|=language] | [lang|=en] | 选择 lang 属性等于 en，或者以 en- 为开头的所有元素 | 2 |
| :link | a:link | 选择所有未访问链接 | 1 |
| :visited | a:visited | 选择所有访问过的链接 | 1 |
| :active | a:active | 选择活动链接 | 1 |
| :hover | a:hover | 选择鼠标在链接上面时 | 1 |
| :focus | input:focus | 选择具有焦点的输入元素 | 2 |
| :first-letter | p:first-letter | 选择每一个`<p>`元素的第一个字母 | 1 |
| :first-line | p:first-line | 选择每一个`<p>`元素的第一行 | 1 |
| :first-child | p:first-child | 指定只有当`<p>`元素是其父级的第一个子级的样式。 | 2 |
| :before | p:before | 在每个`<p>`元素之前插入内容 | 2 |
| :after | p:after | 在每个`<p>`元素之后插入内容 | 2 |
| :lang(language) | p:lang(it) | 选择一个lang属性的起始值="it"的所有`<p>`元素 | 2 |
| element1~element2 | p~ul | 选择p元素之后的每一个ul元素 | 3 |
| [attribute^=value] | a[src^="https"] | 选择每一个src属性的值以"https"开头的元素 | 3 |
| [attribute$=value] | a[src$=".pdf"] | 选择每一个src属性的值以".pdf"结尾的元素 | 3 |
| [attribute*=value] | a[src*="runoob"] | 选择每一个src属性的值包含子字符串"runoob"的元素 | 3 |
| :first-of-type | p:first-of-type | 选择每个p元素是其父级的第一个p元素 | 3 |
| :last-of-type | p:last-of-type | 选择每个p元素是其父级的最后一个p元素 | 3 |
| :only-of-type | p:only-of-type | 选择每个p元素是其父级的唯一p元素 | 3 |
| :only-child | p:only-child | 选择每个p元素是其父级的唯一子元素 | 3 |
| :nth-child(n) | p:nth-child(2) | 选择每个p元素是其父级的第二个子元素 | 3 |
| :nth-last-child(n) | p:nth-last-child(2) | 选择每个p元素的是其父级的第二个子元素，从最后一个子项计数 | 3 |
| :nth-of-type(n) | p:nth-of-type(2) | 选择每个p元素是其父级的第二个p元素 | 3 |
| :nth-last-of-type(n) | p:nth-last-of-type(2) | 选择每个p元素的是其父级的第二个p元素，从最后一个子项计数 | 3 |
| :last-child | p:last-child | 选择每个p元素是其父级的最后一个子级。 | 3 |
| :root | :root | 选择文档的根元素 | 3 |
| :empty | p:empty | 选择每个没有任何子级的p元素（包括文本节点） | 3 |
| :target | #news:target | 选择当前活动的#news元素（包含该锚名称的点击的URL） | 3 |
| :enabled | input:enabled | 选择每一个已启用的输入元素 | 3 |
| :disabled | input:disabled | 选择每一个禁用的输入元素 | 3 |
| :checked | input:checked | 选择每个选中的输入元素 | 3 |
| :not(selector) | :not(p) | 选择每个并非p元素的元素 | 3 |
| ::selection | ::selection | 匹配元素中被用户选中或处于高亮状态的部分 | 3 |
| :out-of-range | :out-of-range | 匹配值在指定区间之外的input元素 | 3 |
| :in-range | :in-range | 匹配值在指定区间之内的input元素 | 3 |
| :read-write | :read-write | 用于匹配可读及可写的元素 | 3 |
| :read-only | :read-only | 用于匹配设置 "readonly"（只读） 属性的元素 | 3 |
| :optional | :optional | 用于匹配可选的输入元素 | 3 |
| :required | :required | 用于匹配设置了 "required" 属性的元素 | 3 |
| :valid | :valid | 用于匹配输入值为合法的元素 | 3 |
| :invalid | :invalid | 用于匹配输入值为非法的元素 | 3 |


## FlexBox 布局 [^1]

[^1]: [弹性盒子 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Flexbox)

### Flexbox 基础知识 [^2]

[^2]: [Flexbox 基础知识_allway2的博客-CSDN博客](https://blog.csdn.net/allway2/article/details/125083126)

#### 弹性item

当display: flex应用于.container div 时，所有直接子 div 变为flex-items，并获得新的行为 [2]：

- 它们将显示在一行中，因为flex-direction默认为row
- 它们将从左到右显示
- 项目不会拉伸以适应整个宽度（主轴），但它们会收缩以做到这一点。
- 项目拉伸以适应交叉轴（本例中的高度）。
- 如果物品有不同的高度，它们将伸展到最高的一个高度
- flex-basis默认为auto（项目宽度将由其内容设置）
- flex-wrap默认为nowrap（如果容器的宽度不足以容纳物品，它们不会包装，而是会溢出）

#### 弹性容器

- display: flex使容器扩展可用的整个宽度。与flex相反display: inline-flex，它使容器折叠到内容的宽度。

#### flex-direction

一旦声明为 flex 容器，该元素就可以被认为是两个轴。主轴，由flex-direction属性定义。和交叉轴，它垂直于第一个。

该属性有四个值flex-direction：row、row-reverse和。columncolumn-reverse

默认值为row，它设置主轴水平，从左到右，横轴垂直截取它，从上到下。类似地，该column值设置垂直轴，从上到下，交叉轴从左到右。两个选项的reverse属性都将主轴反转 180°。交叉轴保持不变。

这些值的弹性项目行为可以在下面观察到：

#### flex-wrap

flex-wrap是当容器中的空间不足以容纳所有弹性项目时处理弹性项目的属性。

默认情况下flex-wrap设置为nowrap，这意味着如果容器不能以原始宽度容纳一行中的项目，它们将缩小以适应。如果由于某种原因它们无法收缩，那么它们会溢出容器。

通过为项目设置 300px 宽度，该nowrap选项会输出以下结果：

其中，每个项目都缩小到大约 70px 以适应容器。

当属性更新为 时wrap，项目的宽度现在实际上将具有其原始值 300 像素。当第一行的宽度不足以容纳 300 像素时，该项目不会溢出容器，而是换行到新行。

每一行都应该被认为是一个单独的弹性容器。一个容器中的空间分布不会影响相邻的其他容器。

另一种选择是wrap-reverse，它反转交叉轴。flex-direction由属性从上到下设置，wrap-reverse将其转换为从下到上。

#### 弹性流

`flex-direction`并且`flex-wrap`可以在单个属性中声明：`flex-flow: [direction] [wrap]`

#### 对齐

![](http://timpcfan-site.cdn.bcebos.com/imgs/invnoF.png)

在 Flexbox 中，项目沿轴的对齐和空间分布可以通过四个属性来控制 ：

justify-content：对齐主轴上的所有项目
align-items：对齐交叉轴上的所有项目
align-self：在交叉轴上对齐单个项目
align-content: 控制交叉轴上弯曲线之间的空间

#### 弹性盒尺寸

项目的大小和灵活性可以通过三个属性来控制flex-grow：flex-shrink和flex-basis。这三个都作用于主轴。

flex-grow: 如果有多余的空间，每个项目应该如何放大
flex-shrink: 如果没有足够的空间，每个项目应该如何减少
flex-basis: 在设置上面两个属性之前，项目应该是什么大小

#### flex-grow

此属性的flex grow factor设置是处理项目大小相对于彼此的比率。

默认值为 0，表示如果有可用空间，则将其放在最后一项之后。

![](http://timpcfan-site.cdn.bcebos.com/imgs/55rRLZ.png)

在上面的示例中，direction设置为row，并且每个弹性项目width都设置为60px。由于容器很980px宽，因此有680px可用空间。该空间称为positive free space。

通过设置flex-grow为1，正的可用空间量在弹性项目之间平均分配。每个项目的宽度将增加136px，总计196px。

![](http://timpcfan-site.cdn.bcebos.com/imgs/5trUDz.png)

通过`flex-grow: 2`应用于第三个项目，它获得的可用正可用空间量是`286px`其余项目的两倍，`173px`。

下图显示了`flex-grow`属性设置为其内容值的项目。

![](http://timpcfan-site.cdn.bcebos.com/imgs/1ftKa2.png)

#### flex-shrink

flex-shrink处理项目大小，当没有足够的可用空间将它们全部放入容器中时。因此，它negative free space通过缩小项目来划分项目。

下一张图片显示了980px装有五个300px宽物品的容器。由于没有空间容纳1500px所需，默认flex shrink factor值1使每个项目均匀收缩到196px。

![](http://timpcfan-site.cdn.bcebos.com/imgs/Y3Pm8q.png)

通过`flex-shrink: 2`为第三项设置比率，它会比其他项小两倍。

![](http://timpcfan-site.cdn.bcebos.com/imgs/Wcu0xX.png)

本节中的最后一张图片显示了将其内容值保存为 flex 收缩率的每个项目。

![](http://timpcfan-site.cdn.bcebos.com/imgs/uAEXro.png)

#### flex-basis

flex-basis是在实际设置可用空间之前检查每个项目应具有的大小的属性。默认值为auto，并且项目宽度由width属性显式设置，或者采用内容宽度。它还接受像素值。

下面的 gif 显示了一个800px宽容器和五个设置为flex-basis: 160px. 这告诉浏览器：理想情况下，有足够的空间来放置所有项目，尊重它们的160px宽度，并且没有正/负的可用空间。如果没有足够的空间，由于flex-shrink默认为1，所有项目都被均匀收缩。如果有多余的空间，则flex-grow默认为0，并且空白空间位于最后一项之后。

![](http://timpcfan-site.cdn.bcebos.com/imgs/SKURrp.png)

下一个 gif 显示项目 1 设置为`flex-shrink: 10`，项目 4 设置为`flex-grow: 10`。对于负的可用空间，项目 1 的宽度减少了 10 倍。对于正的可用空间，项目 4 的宽度是其他项目的 10 倍。

![](http://timpcfan-site.cdn.bcebos.com/imgs/B184OW.png)

`flex-basis`也接受 value `content`，无论`width`是否设置，计算可用空间的宽度都是项目的内容。如果您不想考虑该计算的项目宽度，请将基础设置为`0`。

#### flex

flex是 , 和 的简写属性flex-grow,flex-shrink按flex-basis该顺序.

它接受以下预定义值：

initial: 重置为 flexbox 默认值，与 flex: 0 1 auto 相同
auto: flex-items 可以根据需要增长/缩小，与 flex: 1 1 auto 相同
none: 使项目不灵活，与 flex: 0 0 auto 相同
flex: 1: flex-items 具有增长/收缩的能力并且flex-basis设置为零，与 flex: 1 1 0 相同


### 几个例子

#### 例子：居中对齐

```css
.CenterMe {
	background-color: indigo;
	color: #ebebeb;
	font-size: 2rem;
	height: 200px;
	display: flex;
	align-items: center; /* 沿着交叉轴对齐 */
	justify-content: center; /* 沿着主轴对齐 */
}

<div class="CenterMe">Hello, I'm centered with Flexbox!</div>
```

![K3PDPP](http://timpcfan-site.cdn.bcebos.com/imgs/K3PDPP.png)

#### 例子：偏移

```css
.LastItem,
.ListItem {
  color: #ebebeb;
  text-decoration: none;
}

.ListItem {
  margin-right: 1rem;
}

.LastItem {
  margin-left: auto; /* 用上该侧所有可用的外边距 */
}

<div class="MenuWrap">
  <a href="#" class="ListItem">Home</a>
  <a href="#" class="ListItem">About Us</a>
  <a href="#" class="ListItem">Products</a>
  <a href="#" class="ListItem">Policy</a>
  <a href="#" class="LastItem">Contact Us</a>
</div>
```

![9jnlas](http://timpcfan-site.cdn.bcebos.com/imgs/9jnlas.png)

#### 例子：反序

让所有项反序排列

```css
flex-direction: row-reverse
```

::: info
此外还有 column-reverse  为垂直反序。
:::

### flexbox的对齐

关于Flexbox的对齐，最重要的是理解坐标轴。有两个轴，“主轴”和“交叉轴”。这两个轴代表什么取决于Flexbox排列的方向。比如，如果将Flexbox的方向设置为`row`，则主轴就是横轴， 而交叉轴就是纵轴。

反之，如果Flexbox的方向是`column`，则主轴就是纵轴，而交叉轴为横轴。

![OioNsa](http://timpcfan-site.cdn.bcebos.com/imgs/OioNsa.png)

#### 沿着交叉轴对齐

设置的属性：

- align-items：设置容器内所有item沿交叉轴对齐的方式（对容器内元素）
- align-self：针对内部元素，设置特定的沿交叉轴对齐的方式（对自己）

对齐的方式：

- flex-start: 把元素的对齐设置为flex-start，可以让元素从Flexbox父元素的起始边 开始。
- flex-end: 把元素的对齐设置为flex-end，会沿Flexbox父元素的末尾对齐该元素。
- center: 把元素放在Flexbox元素的中间。
- baseline: 让Flexbox元素中的所有项沿基线对齐。
- stretch: 让Flexbox中的所有项(没交叉轴)拉伸至与父元素一样大

#### 沿着主轴对齐

设置的属性：

- justify-content：设置容器内所有item沿主轴的对齐方式

对齐的方式：

- flex-start
- flex-end
- center
- space-between：设置如何处理空白，将空白分配到元素之间
- space-around：设置如何处理空白，将空白分配到元素两边

```css
<div class="FlexWrapper">
	<div class="FlexInner">I am content in the inner Flexbox 1.</div>
	<div class="FlexInner">I am content in the inner Flexbox 2.</div>
	<div class="FlexInner">I am content in the inner Flexbox 3.</div>
</div>
/* 再看以下CSS。我们把每个内部元素(FlexInner)的宽度都设置为25%，包含它们的容器
Flexbox(FlexWrapper)的宽度为100% */
.FlexWrapper {
	background-color: indigo;
	display: flex;
	justify-content: space-between;
	height: 200px;
	width: 100%;
}
.FlexInner {
  background-color: #34005B;
  display: flex;
  height: 100px;
  width: 25%;
}
```

![Iqs9fg](http://timpcfan-site.cdn.bcebos.com/imgs/Iqs9fg.png)

### flex属性

前面已经给伸缩项(flex-item)定义过宽度了。除了width，还可以通过flex属性来定义宽 度，或者叫“伸缩性”(flexiness)。再看另一个例子，同样的标记，但CSS有所不同:

```css
.FlexInner {
  border: 1px solid #ebebeb;
  background-color: #34005B;
  display: flex;
  height: 100px;
	flex: 1;
}
```

这里的flex实际上是三个属性合体的简写:flex-grow、flex-shrink和flex-basis。 关于这三个属性的详细介绍，可以参考规范[原文](https://www.w3.org/TR/css-flexbox-1/)。不过， 规范还是建议大家使用flex这个简写属性，也就是我们这里用的这个，明白吗?

```css
flex: 1       1     100px
      伸展    收缩    基准
```

对于伸缩项，如果flex属性存在(且浏览器支持)，**则使用它的值控制元素的大小，忽略宽度和高度值的设置**，即使它们的声明位于flex声明之后，也会被忽略。下面分别看看这三个 属性。

- flex-grow(传给flex的第一个值)是相对于其他伸缩项，当前伸缩项在空间允许的情况下可以伸展的量。
- flex-shrink是在空间不够的情况下，当前伸缩项相对于其他伸缩项可以收缩的量。
- flex-basis(传给flex的最后一个值)是伸缩项伸缩的基准值。

虽然只写`flex: 1`也没问题，但还是建议大家把三个值写全。这样才能更清楚地表明你想干什么。比如`flex: 1 2 auto`的意思是在有空间的情况下可以伸展1部分，在空间不足时可以收缩1部分，而**基准大小是内容的固有宽度**(即不伸缩的情况下内容的大小)。
再试一个:`flex: 0 0 50px`的意思是，这个伸缩项既不伸也不缩，基准为50像素(即无论是否存在自由空间，都是50像素)。那么`flex: 2 0 50%`呢?意思就是会多占用两个可用空间， 不收缩，基准为50%。但愿这几个例子能帮大家理解flex属性。

::: tip
将flex-shrink的值设置为0，flex-basis实际上就相当于最小宽度。
:::


## Grid 布局

[网格 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Grids#flexbox_%E7%BD%91%E6%A0%BC)

![](http://timpcfan-site.cdn.bcebos.com/imgs/GwfRmw.png)

一个网格通常具有许多的**列（column）**与**行（row）**，以及行与行、列与列之间的间隙，这个间隙一般被称为**沟槽（gutter）**。

### 定义网格

在一个父容器中使用：`display: grid;` ，将这个容器改为网格布局。

- 初始状态：只有一列的网格，你的子项还是会像正常布局流那样从上往下排布。

```css
.container {
    display: grid;
    grid-template-columns: 200px 200px 200px;
}
```

使用 `grid-template-columns` 来定义多个列，每个参数代表一个列的宽度。可以使用 `fr` 这个单位来灵活定义网格的行与列的大小。这个单位表示了**可用空间**的一个比例。

```css
grid-template-columns: 1fr 1fr 1fr;          /* 三个列，每个列宽度相等 */
grid-template-columns: 400px 1fr 1fr;        /* 三个列，后面两个列的宽度为：(总宽度-400px)/2 */
grid-template-columns: repeat(3, 1fr);       /* 三个列，可以使用repeat函数来重复定义 */
grid-template-columns: repeat(2, 1fr, 2fr);  /* 1fr 2fr 1fr 2fr */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* auto-fill 表示填满屏幕，minmax限制大小 */
```

::: info
同样的，使用 `grid-template-rows` 可以定义多个行 ，每个参数代表一个行的高度。
:::

#### 网格间隙

```css
gap: 20px;  /* 标准 */
grid-gap: 20px;  /* 旧 */
grid-row-gap: 20px;  /* 行间距 */
grid-column-gap: 20px;  /* 列间距 */
```

#### 显式网格与隐式网格

使用 `grid-template-columns` 与 `grid-template-rows` 定义的网络称为显式网格，而多余的内容则会继续往下填充到新的行的格子内，这些格子被称为隐式网格。

隐式网格的默认行/列大小是参数`auto` ，大小会根据放入的内容自动调整。也可以使用 `[grid-auto-rows](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid-auto-rows)`和`[grid-auto-columns](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid-auto-columns)`属性手动设定隐式网格的大小。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
  grid-gap: 20px;
}
```

### 元素放置

#### 基于线的元素放置

定义完网格之后，每行每列的边界（网格线的边缘）都有一个索引，可以使用这些线来定位放置元素。

![](http://timpcfan-site.cdn.bcebos.com/imgs/xHBtux.png)

```css
grid-column-start: 1  /* 列的开始边界 */
grid-column-end: 3  /* 列的结束边界，因此 1 / 3 表示 1、2列 */
grid-row-start: 2
grid-row-end: 3
/* 或者 */
grid-column: 1 / 3
grid-row: 2
```

::: info
可以使用负数来进行倒数，但对于隐式网格来说 -1 不一定代表最后一条分界线。
:::

#### 使用 grid-template-areas 属性放置元素

另一种往网格放元素的方式是用`[grid-template-areas](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid-template-areas)`属性，并且你要命名一些元素并在属性中使用这些名字作为一个区域。

将之前基于线的元素放置代码删除（或者重新下载一份新的文件），然后加入以下 CSS 规则：

```css
.container {
  display: grid;
  grid-template-areas:
      "header header"
      "sidebar content"
      "footer footer";
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
}

header {
  grid-area: header;
}

article {
  grid-area: content;
}

aside {
  grid-area: sidebar;
}

footer {
  grid-area: footer;
}
```

`grid-template-areas`属性的使用规则如下：

- 你需要填满网格的每个格子
- 对于某个横跨多个格子的元素，重复写上那个元素`grid-area`属性定义的区域名字
- 所有名字只能出现在一个连续的区域，不能在不同的位置出现
- 一个连续的区域必须是一个矩形
- 使用`.`符号，让一个格子留空

你可以在文件中尽情发挥你的想象来测试各种网格排版，比如把页脚放在内容之下，或者把侧边栏一直延伸到最底。这种直观的元素放置方式很棒，你在 CSS 中看到的就是实际会出现的排版效果。