---
title: Vue.js 笔记
icon: vue
category:
  - 笔记
  - 前端
tag:
  - 前端
  - vue.js
---

::: tip
Vue (读音 /vjuː/，类似于  view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。
:::

::: warning
本笔记整理较为混乱，建议使用[官方文档](https://cn.vuejs.org)学习。
:::

## 相关学习资源

- [Vue2 文档](https://v2.cn.vuejs.org)

- [Vue3 文档](https://cn.vuejs.org)

## vue 简介

![AYFU9u](http://timpcfan-site.cdn.bcebos.com/imgs/AYFU9u.png)

官方给 vue 的定位是前端框架，因为它提供了构建用户界面的一整套解决方案（俗称 vue 全家桶）

- vue（核心库）
- vue-router（路由方案）
- vuex（状态管理方案）
- vue 组件库（快速搭建页面 UI 效果的方案）

以及辅助 vue 项目开发的一系列工具：

- vue-cli（npm 全局包：一键生成工程化的 vue 项目 - 基于 webpack，大而全）
- vite（npm 全局包：一键生成工程化的 vue 项目 - 小而巧）
- vue-devtools（浏览器插件：辅助调试的工具）
- vetur（vscode 插件：提供语法高亮和智能提示）

### vue 的特性

- 数据驱动视图：
  - 在使用了 vue 的页面中，vue 会监听数据的变化，从而自动重新渲染页面的结构。
  - 好处：当页面数据发生变化时，页面会自动重新渲染。
  - 注：这是单向的数据绑定
- 双向数据绑定
  - 在填写表单时，双向数据绑定可以辅助开发者在不操作 DOM 的前提下，自动把用户填写的内容同步到数据源中。

### MVVM

MVVM 是 vue 实现**数据驱动视图**和**双向数据绑定**的核心原理。它把每个 HTML 页面都拆分成了三个部分：

- View：当前页面所渲染的 DOM 结构
- Model：当前页面渲染时所依赖的数据源
- ViewModel：表示 vue 的实例，它是 MVVM 的核心，连接 View 与 Model

![mZ91S3](http://timpcfan-site.cdn.bcebos.com/imgs/mZ91S3.png)

![qF2xKn](http://timpcfan-site.cdn.bcebos.com/imgs/qF2xKn.png)

### vue 的版本

- 2.x 版本是目前企业级项目开发中的主流版本
- 3.x 版本于 2020-09-19 发布，是未来企业级项目开发的趋势

### 2.x 与 3.x 的对比

- 2.x 的绝大多数 API 在 3.x 中同样支持。
- 3.x 新增：组合式 API、多根节点组件、更好的 TypeScript 支持等
- 3.x 废弃：过滤器、不再支持$on，$off 和$once 实例方法等

## vue 基础

渐进式 JavaScript 框架

### 第一个 Vue 程序

1. 导入开发版本的 Vue.js
2. 创建 Vue 实例对象，设置 `el` 属性和 `data` 属性
3. 使用简洁的模板语法把数据渲染到页面上

```tsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>基础</title>
  </head>
  <body>
    <div id="app">
      <h1>{{ message }}</h1>
    </div>
    <script src="https://unpkg.com/vue@next"></script>
    <script>
      var vm = new Vue({
        el: "#app",
        data: {
          message: "Hello Vue!",
        },
      });
    </script>
  </body>
</html>
```

#### el：挂载点

- Vue 实例的作用范围？
  - 作用在 `el` 作用的元素内部（包括任意层次的子标签）
- 其值可以使用其他选择器吗？
  - 可以，css 选择器都可以，但建议使用 ID 选择器
- 是否可以设置其他的 dom 元素
  - 可以，但建议使用 div 标签，因为没有其他样式

#### data：数据对象

- Vue 中用到的数据定义在 `data` 中
- `data` 中可以写复杂类型的数据
- 渲染复杂类型的数据时，遵守 js 的语法即可

## vue 指令

### v-text

> 设置标签的文本值（textContent）

```html
<div id="app">
  <h1>她说：{{ message }}</h1>
  <h1>她说：{{ message+'???' }}</h1>
  <h1 v-text="message"></h1>
  <h1 v-text="message+'???'"></h1>
</div>
```

将标签中的文本，都使用 `data` 的指定属性替换。

可以在 v-text 中拼接字符串。

### v-html

> 设置标签的 innerHTML

与 `v-text` 类似，不过如果设置的文本为 html 内容会进行解析。

### v-on 基础

> 为元素绑定事件

语法：`v-on:事件名="方法名"` 或者 `@事件名="方法名"`

- 方法定义在 Vue 对象的 `methods` 属性中。
- 方法内部通过 `this` 关键字可以访问定义在 `data` 中的数据
- 如果是直接将方法写在属性的位置，则不需要 `this.xxx`

```html
<div id="app">
  <input type="button" value="事件绑定" v-on:click="method1" />
  <input type="button" value="事件绑定" @click="method1" />
  <input type="button" value="事件绑定" v-on:monseenter="method2" />
  <input type="button" value="事件绑定" @dblclick="message='点击啦'" />
</div>
```

::: note
注：事件名不需要写 `on` 因为左侧 `v-on` 已经有了
:::

```jsx
var app = new Vue({
  el: "#app",
  data: {
    message: "hello",
  },
  methods: {
    method1: function () {
      this.message = "你好吗";
    },
    method2: function () {},
  },
});
```

### v-show

> 根据表达值的真假，切换元素的显示和隐藏

```html
<div id="app">
  <p v-show="true">hhh</p>
  <p v-show="isShow">hhh</p>
  <p v-show="age>=18">hhh</p>
</div>
```

```jsx
var app = new Vue({
  el: "#app",
  data: {
    isShow: false,
    age: 16,
  },
});
```

### v-if

> 根据表达值的真假，切换元素的显示和隐藏（操纵 dom 元素）

与 `v-show` 类似，但操纵的是 dom 元素（在 dom 中添加或删除该标签）

::: info 如何选择 `v-show` 还是 `v-if` ？

频繁切换的元素使用 `v-show` ，否则使用 `v-if`

:::

### v-else

> 与 v-if 配合，切换元素的显示和隐藏

::: warning
前一兄弟元素必须有  `v-if`  或  `v-else-if`。

:::

### v-else-if

> 与 v-if 配合，切换元素的显示和隐藏

```jsx
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

### v-bind

> 设置元素的属性（比如：src, title, class）

语法：`v-bind:属性名=表达式` 或 `:属性名=表达式`

```html
<div id="app">
  <img v-bind:src="imgSrc" />
  <img v-bind:title="imgtitle+'!!!'" />
  <img :class="isActive?'active':''" />
  <img :class="{active:isActive}" />
  <!-- 对象的写法：active 是否生效，取决于 isActive 的值 -->
</div>
```

::: info
设置 `class` 属性时，建议使用对象的写法（第 4 个）

:::

### v-for

> 根据数据生成列表结构

```html
<div id="app">
  <ul>
    <li v-for="item in arr" :title="item">{{ item }}</li>
    <li v-for="(item, index) in arr">{{ index }}{{ item }}</li>
  </ul>
</div>
```

```jsx
var app = new Vue({
  el: "#app",
  data: {
    arr: [1, 2, 3, 4, 5],
  },
});
```

::: warning
当列表的数据变化时，默认情况下，vue 会尽可能地复用已存在的 DOM 元素，从而提升渲染的性能。但这种默认的性能优化策略，会**导致有状态的列表无法被正确更新**。此时，需要为每项提供一个**唯一**的 key 属性（不能使用 index）：

```jsx
<ul>
  <li v-for="user in userlist" :key="user.id">
    <input type="checkbox" />
    姓名：{{user.name}}
  </li>
</ul>
```

:::

### v-on 补充

> 传递自定义参数，事件修饰符

```html
<div id="app">
  <input type="button" @click="method1(p1,p2)" />
  <input type="text" @keyup.enter="sayHi" />
</div>
```

```jsx
var app = new Vue({
  el: "#app",
  methods: {
    method1: function (p1, p2) {},
    sayHi: function () {},
  },
});
```

**解释**

- 可以在 v-on 的属性中传入函数的参数
- 对于事件，可以使用修饰符

**修饰符**（文档：[https://v2.cn.vuejs.org/v2/api/#v-on](https://v2.cn.vuejs.org/v2/api/#v-on)）

- `.stop` - 调用  `event.stopPropagation()`。（阻止冒泡行为（内到外））
- `.prevent` - 调用  `event.preventDefault()`。（例如：阻止超链接的跳转）
- `.capture` - 添加事件侦听器时使用 capture 模式。（定义在外层组件上，以捕获的形式来触发事件（外到内））
- `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。（只有点他自己才会触发，而不受冒泡影响）
- `.{keyCode | keyAlias}` - 只当事件是从特定键触发时才触发回调。
- `.native` - 监听组件根元素的原生事件。
- `.once` - 只触发一次回调。
- `.left` - (2.2.0) 只当点击鼠标左键时触发。
- `.right` - (2.2.0) 只当点击鼠标右键时触发。
- `.middle` - (2.2.0) 只当点击鼠标中键时触发。
- `.passive` - (2.3.0) 以  `{ passive: true }`  模式添加侦听器

#### 事件对象 event

在原生的 DOM 事件绑定中，可以在事件处理函数处，接收事件对象 event。同理，在 v-on 指令所绑定的事件处理函数中，同样可以接收到事件对象 event：

```jsx
<button @click="addCount">+1</button>
// ----------------------------------------------------
methods: {
  addCount(e) { // e 为事件对象
    const color = e.target.style.backgroundColor
    e.target.style.backgroundColor = color === 'red' ? '' : 'red'
    this.count += 1
  }
}
```

当传递参数时，event 对象将被覆盖掉，此时我们可以传递一个特殊的参数 `$event` 来表示原生的事件参数对象：

```jsx
<button @click="addCount(step, $event)">+1</button>
// ----------------------------------------------------
methods: {
  addCount(step, e) { // e 为事件对象
    console.log(step)
    const color = e.target.style.backgroundColor
    e.target.style.backgroundColor = color === 'red' ? '' : 'red'
    this.count += 1
  }
}
```

### v-model

> 获取和设置表单元素的值（**双向数据绑定**）

- 绑定的是 `input` 的 `value` 属性
- 之后无论是在表单中直接修改元素，还是在 js 中修改绑定的变量，都会使得两边的值都被改变

```html
<div id="app">
  <input type="text" v-model="message" />
  <p>{{ message }}</p>
</div>
```

```jsx
var app = new Vue({
  el: "#app",
  data: {
    message: "lalala",
  },
});
```

## vue 过滤器（vue2.x 内容）

过滤器（Filters）常用于文本的格式化。例如：hello → Hello

过滤器应该被添加在 JavaScript 表达式的尾部，由“管道符”进行调用，示例代码如下：

```jsx
<p>{{ message | capitalize }}</p>

<div v-bind:id="rawId | formatId"></div>
```

过滤器可以用在两个地方：

- 插值表达式（{{}}）
- 和 v-bind 属性绑定（:xxx）

在创建 vue 实例期间，可以在 filters 节点中定义过滤器，示例代码：

```jsx
const vm = new Vue({
  el: "#app",
  data: {
    message: "hello vue.js",
    info: "title info",
  },
  filters: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
});
```

### 连续调用多个过滤器

```jsx
<p>{{ text | capitalize | maxLength }}</p>
```

### 过滤器传参

```jsx
<p>{{ message | filterA(arg1, arg2) }}</p>

Vue.filter('filterA', (msg, arg1, arg2) => {...})  // msg永远是第一个参数
```

### 版本兼容性

3.x 版本中取消掉了过滤器的特性，官方建议使用[计算属性](#计算属性)或**方法**代替之。

## vue 组件基础

如何创建 vite 项目：[vue 项目的创建](vue%E9%A1%B9%E7%9B%AE%E7%9A%84%E5%88%9B%E5%BB%BA%204c93df69f97b409eaef1c2a6e7c960e7.md)

### 组件化开发思想

::: info
根据封装的思想，把页面上可重用的部分封装成组件，从而方便项目的开发和维护。

:::

vue 是一个完全支持组件化开发的框架。vue 中规定组件的后缀名是 .vue。

### vue 组件的构成

每个.vue 组件都由 3 部分构成，分别是：

- template → 组件的模板结构（必需）
- script → 组件的 JavaScript 行为（可选）
- style → 组件的样式（可选）

#### 组件的 template 节点

在组件 `<template>` 节点中，支持使用 vue 指令，来辅助渲染当前组件的 DOM 结构。

::: warning
2.x 中，template 标签内仅支持单一根节点，3.x 中取消了该限制。

:::

#### 组件的 script 节点

vue 规定：组件内 `<script>` 节点是可选的，开发者可以在 `<script>` 节点中封装组件的 JavaScript 业务逻辑。 `<script>` 节点的基本结构如下：

```jsx
<script>
// 今后，组件相关的 data 数据、methods 方法等，
// 都需要定义到 export default 所导出的对象中。
export default {
    name: 'MyApp', // name属性表示组件名称（建议首字母大写）
    data() {  // 组件中 data 需要指向一个函数，而不是一个对象！！
        return {
            username: 'lzt',
            count: 0,
        }
    },
    methods: {
        addCount() {
            this.count++;
        },
    },
}
</script>
```

#### 组件中的 style 节点

vue 规定：组件内的 `<style>` 节点是可选的，开发者可以在 `<style>` 节点中编写样式美化当前组件的 UI 结构。 `<style>` 节点的基本结构如下：

```jsx
<style lang="css">
h1 {
    font-weight: normal;
}
</style>
```

::: info
也可以使用其他的语法，如 less 等，需要安装相应的依赖包：`npm install less -D`

:::

### 组件的注册

组件之间可以进行相互的引用，例如：

![SieVd6](http://timpcfan-site.cdn.bcebos.com/imgs/SieVd6.png)

vue 中组件的引用原则：先注册后使用。

#### 组件注册的两种方式

vue 中注册组件的方式分为“全局注册”和“局部注册”两种，其中：

- 全局注册：可以在全局任何一个组件内使用
- 局部注册：只能在当前注册的范围内使用

#### 全局注册组件

```jsx
// main.js
import { createApp } from "vue";
import App from "./App.vue";

// 1. 导入需要被全局注册的组件
import Swiper from "./components/01.globalReg/Swiper.vue";
import Test from "./components/01.globalReg/Test.vue";

const app = createApp(App);

// 2. 调用 app.compenent() 方法全局注册组件
app.compenent("my-swiper", Swiper);
app.compenent("my-test", Test);

app.mount("#app");
```

```jsx
// App.vue
// 3. 在页面中使用上面定义的标签名
<template>
  <my-swiper></my-swiper>
  <my-test></my-test>
</template>
```

#### 局部注册组件

```jsx
<template>
    <my-search></my-search>
</template>

<script>
import MySearch from './compenents/MySearch.vue'
export default {
    compenents: {  // 通过 compenents 节点，为当前的组件注册私有子组件
        'my-search': MySearch,
        MySearch, // 也可以直接这样，这是使用大驼峰法命名
    },
}
</script>
```

#### 组件注册时的命名

- 使用 kebab-case 命名法（短横线命名法，如 my-swiper ）
  - 必须严格按照短横线名称进行使用
- 使用 PascalCase 命名法（帕斯卡命名法或大驼峰法，如 MySwiper）
  - 既可以严格按照帕斯卡名称使用，也可以转换成短横线名称使用

可以直接使用组件的.name 属性

```jsx
// main.js
app.compenent(Swiper.name, Swiper); // Swiper.name === 'MySwiper'
app.compenent(Test.name, Test); // Test.name === 'MyTest'
```

### 组件之间样式冲突问题

::: info
若在父组件中定义样式，会影响到子组件的样式，这样就很容易造成多个组件之间的样式冲突问题。导致组件冲突问题的根本原因是：

1. 单页面应用程序中，所有组件的 DOM 结构，都是基于**唯一的 index.html 页面**进行呈现的
2. 每个组件中的样式，都会影响整个 index.html 页面中的 DOM 元素
   :::

#### 使用自定义属性解决样式冲突

为每个组件**分配唯一的自定义属性**，在编写组件样式时，通过**属性选择器**来控制**样式的作用域**：

```jsx
<template>
    <div class="container" data-v-001>
        <h3 data-v-001>轮播图组件</h3>
    </div>
</template>

<style>
  /* 通过中括号“属性选择器”，来防止组件之间的样式冲突问题 */
    .container[data-v-001] {
        border: 1px solid red;
    }
</style>
```

#### 使用 scoped 属性解决样式冲突

手动分配自定义属性非常难以维护，可以使用 style 节点的 scoped 属性，vue 将自动分配自定义属性：

```jsx
<template>
    <div class="container">
        <h3>轮播图组件</h3>
    </div>
</template>

<style **scoped**>
    .container {
        border: 1px solid red;
    }
</style>
```

#### /deep/ 样式穿透

如果给当前组件的 style 节点添加了 scoped 属性，则当前组件的样式对其子组件是不生效的。如果想让某些样式对子组件生效，可以使用 /deep/ 深度选择器。

```jsx
<style lang="less scoped>
.title {
    color: blue; /* 不加 /deep/ 时，生成 .title[data-v-xxx] */
}

/deep/ .title {
    color: blue; /* 加上 /deep/ 时，生成 [data-v-xxx] .title */
}

:deep(.title) {
    color: blue; /* 这是3.x的推荐写法，生成 [data-v-xxx] .title */
}
</style>
```

### 组件的 props

为了提高组件的复用性，在封装 vue 组件时需要遵守如下的规则：

- 组件的**DOM 结构**、**style 样式**要尽量复用
- 组件中**要展示的数据**，尽量由组件的使用者提供

::: info
props 是组件的自定义属性，组件的使用者可以通过 props 把数据传递到子组件内部，供子组件内部进行使用。

:::

例子：

```jsx
<my-article title="面朝大海，春暖花开" author="海子"></my-article>
```

props 的**作用**：父组件通过 props**向子组件传递要展示的数据**。

props 的**好处**：提高了组件的**复用性**。

#### 在组件中声明 props

在封装 vue 组件时，可以把动态的数据项声明为 props 自定义属性。自定义属性可以在当前组件的模板结构中被直接使用。

```jsx
<template>
    <h3>标题：{{title}}</h3>
    <h5>作者：{{author}}</h5>
</template>

<script>
export default {
    **props: ['title', 'author']**, // 父组件传递给my-article组件的数据，必须在props节点中声明
}
</script>
```

::: info
props 中未声明的属性，如果传递会被忽视。

:::

#### 动态绑定 props 的值

可以使用 v-bind 属性绑定的形式，为组件动态绑定 props 的值。

```jsx
<my-article :title="info.title" author="info.author"></my-article>
```

#### props 的大小写命名

组件中如果使用“camelCase（驼峰命名法）”声明了 props 属性的名称，则有两种方式为其绑定属性的值：

```jsx
<script>
export default {
    props: ['**pubTime**'],
}
</script>

<my-article **pubTime**="1989"></my-article>
<my-article **pub-time**="1989"></my-article>
```

#### props 验证

在分装组件时对外界传递过来的 props 数据进行合法性的校验，从而防止数据不合法的问题。使用对象类型的 props 节点，可以对每个 prop 进行数据类型的校验：

```jsx
<script>
export default {
    props: {  // 使用对象类型的 props 而不是数组类型，若不按类型传递会在浏览器中警告
        p1: Number,
        p2: Boolean,
        p3: String,
        p4: Array,
        p5: Object,
        p6: Date,
        p7: Funciton,
        p8: Symbol,  // 共8种基础类型

        pA: [String, Number],  // 可以使用数组来指定多个可能的类型

        pB: { // 使用配置对象形式
            type: String,
            required: true // 当前属性为必填项
        },

        pC: {
            type: String,
            default: "lzt" // 当前属性的默认值
        },

        pD: {
            validator(value) {  // 自定义的验证函数，返回true代表合法
                return ['A', 'B', 'C'].indexOf(value) !== -1
            }
        }
    }
}
</script>
```

### Class 与 Style 绑定

#### 以三元表达式绑定 HTML 的 class

可以使用三元表达式，动态地为元素绑定 class 的类名。

```jsx
<h3 class="thin" :class="isItalic ? 'italic' : ''">halo</h3>
```

#### 以数组语法绑定 HTML 的 clas

如果元素需要动态绑定多个 class 的类名，此时可以使用数组的语法格式。

```jsx
<h3 class="thin" :class="[isItalic ? 'italic' : '', isDelete ? 'delete' : '']">halo</h3>
```

#### 以对象语法绑定 HTML 的 class

推荐使用此方法绑定 class。

```jsx
<h3 class="thin" :class="{italic:isItalic}">halo</h3>
<p :class="classObj">how are you</p>

data() {
    return {
        isItalic: true,
        classObj: { // 对象中，属性名是class名，值是布尔值
            italic: true,  // true代表应用这个类名
            delete: false,  // false代表不应用这个类名
        }
    }
}
```

#### 以对象语法绑定内联的 style

`:style` 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式或短横线分隔（需要加引号）来命名：

```jsx
<div :style="{color: active, fontSize: fsize + 'px', 'background-color': bgcolor}">
    lalala
</div>

data() {
    return {
        active: 'red',
        fsize: 30,
        bgcolor: 'pink',
    }
}
```

### 计算属性

::: info
计算属性本质上就是一个函数，它可以实时监听 data 中数据的变化，并 return 一个计算后的新值，供组件渲染 DOM 时使用。

:::

```jsx
<input type="text" v-model.number="count" />
<p>{{count}} 乘以 2 的值为：{{plus}}</p>

data() {
    return { count: 1 }
},
computed: {
    plus() {
        return this.count * 2
    },
}
```

- 调用时不需要加()，当作普通属性使用。
- 计算属性会缓存结果，只用依赖发生变化时才重新计算，因此性能比方法好。
- 使用场景：购物车金额等

```jsx
computed: {
    total() {
        let t = 0
        this.fruitlist.forEach(x => {
            if (x.state) {
                t += x.count
            }
        })
        return t
    },
    amount() {
        let a = 0
        this.fruitlist.filter(x => x.state).forEach(x => {
            a += x.price * x.count
        })
        return a
    },
    isDisabled() {
        return this.total == 0
    }
}
```

### 自定义事件（子传父）

::: info
在封装组件时，为了让**组件的使用者**可以**监听到组件内状态的变化**，此时需要用到**组件的自定义事件**。

:::

![6LdgWa](http://timpcfan-site.cdn.bcebos.com/imgs/6LdgWa.png)

#### 自定义事件的使用

在封装组件时：

1. **声明**自定义事件：定义自定义组件时，在 emits 节点中声明。
2. **触发**自定义事件：

在使用组件时：

1. **监听**自定义事件

```jsx
// 组件定义
<template>
    <button>press me</button>
</template>

<script>
export default {
    emits: ['change'],  // 1. 声明自定义事件
    methods: {
        onBtnClick() {
            this.$emit('change') // 2. 手动触发自定义事件，参数为自定义事件名称
        },
    },
}
</script>
```

```jsx
// 使用组件
// 3. 使用v-on监听事件
<my-counter @change="getCount"></my-counter>

methods: {
    getCount() {
        console.log('count changed!')
    },
}
```

#### 自定义事件传参

在调用 `this.$emit()` 方法触发自定义事件时，可以通过**第 2 个**参数为自定义事件传参。

```jsx
// 组件定义
<template>
    <button>press me</button>
</template>

<script>
export default {
    emits: ['change'],
    methods: {
        onBtnClick() {
            this.$emit('change', this.count) // 可以使用**第2个**参数来向外传递信息
        },
    },
}
</script>
```

```jsx
// 使用组件
<my-counter @change="getCount"></my-counter>

methods: {
    getCount(val) { // 这里可以得到传递的信息
        console.log('count changed', val)
    },
}
```

### 组件上的 v-model

![hQRD5V](http://timpcfan-site.cdn.bcebos.com/imgs/hQRD5V.png)

v-model 是双向数据绑定指令，当需要**维护组件内外数据的同步**时，可以在组件上使用 v-model 指令。

---

- **外界数据的变化**会**自动同步**到 counter 组件中
- counter 组件中数据的变化，也会**自动同步到外界**。

#### 在组件上使用 v-model 的步骤

![xb4bel](http://timpcfan-site.cdn.bcebos.com/imgs/xb4bel.png)

```jsx
<template>
  <div>
    <h1>父组件 --- count:{{ count }}</h1>
    <button @click="count += 1">+1</button>
    <hr />
    <MyCounter **v-model**:number="count"></MyCounter>
  </div>
</template>
<script>
import MyCounter from "./MyCounter.vue";
export default {
  name: "Father",
  data() {
    return {
      count: 0,
    };
  },
  components: { MyCounter },
};
</script>
```

```jsx
<template>
  <div>
    <p>count值是：{{ number }}</p>
    <button @click="handleClick">-1</button>  // 注意子组件中并没有v-model
  </div>
</template>
<script>
export default {
  name: "MyCounter",
  props: ["number"],
  emits: ["**update:**number"],
  methods: {
    handleClick() {
      this.$emit("update:number", this.number - 1);  // 可以通过 this.number 访问到 props 中的值
    },
  },
};
</script>
```

::: info
`update:xxx` 表示让 v-model 去更新 xxx 的值，为后面传递的参数

:::

::: warning
此词条为 3.x 专属特性，请参考 [官方文档](https://cn.vuejs.org/guide/components/events.html#usage-with-v-model)。

:::

## vue 组件高级

### watch 侦听器

::: info
watch 侦听器允许开发者监视数据的变化，从而**针对数据的变化做特定的操作**。例如，监听用户名的变化并发起请求，判断用户名是否可用。

:::

开发者需要在 watch 节点下，定义自己的侦听器。实例代码如下：

```jsx
export default {
  data() {
    return { username: "" };
  },
  watch: {
    // 监听 username 的值的变化，
    // 形参列表中，第一个值是“变化后的新值”，第二个为“变化之前的旧值”
    username(newVal, oldVal) {
      console.log(newVal, oldVal);
    },
  },
};
```

使用 object 的形式定义 watch，可以设置更多的选项：

- immediate 选项：组件加载完立即调用一次
- deep 选项：当监听的是一个对象，对象的属性值变化都会被监听（若只想监听一个属性，则不需要使用 deep 选项，而是使用 ‘info.username’ 这样的形式作为监听的变量）

```jsx
watch: {
    username: {
        async hander(newVal, oldVal) {  // handler 为处理方法
            const { data: res} = await axios.get(`https://www.example.cn/api/${newVal}`);
            console.log(res)
        },
        immediate: true;  // 表示组件加载完立即调用一次 watch 监听器
    },
},
```

### 组件的生命周期

![hEeD6v](http://timpcfan-site.cdn.bcebos.com/imgs/hEeD6v.png)

组件的生命周期：组件从 **创建** → **运行**（渲染）→ **销毁** 的整个过程，强调的是一个时间段。

生命周期函数：

1. created：当组件在内存中被创建完毕之后调用（唯一一次）
2. mounted：当组件被成功渲染到页面上之后调用（唯一一次）
3. unmounted：当组件被销毁完毕之后调用（例如 v-if 为 false）（唯一一次）
4. updated：组件被重新渲染（data 更新了）完毕之后调用（0 至多次）
5. beforeCreate 等：在上述周期之前执行。

::: info
在实际开发中，created 是最常用的，比如进行 ajax 请求数据。若需要操作 dom 元素，则需要使用 mounted，因为 created 时组件还未被渲染。

:::

### 组件之间的数据共享

在项目开发中，组件之间的关系分为如下 3 种：

1. 父子关系
2. 兄弟关系
3. 后代关系

#### 父子组件的数据共享

父子组件之间的数据共享又分为：

1. 父 → 子
2. 子 → 父
3. 父 ↔  子

![X1WYvK](http://timpcfan-site.cdn.bcebos.com/imgs/X1WYvK.png)

![gRIHQf](http://timpcfan-site.cdn.bcebos.com/imgs/gRIHQf.png)

![TktxFT](http://timpcfan-site.cdn.bcebos.com/imgs/TktxFT.png)

#### 兄弟组件的数据共享

![DWEqdA](http://timpcfan-site.cdn.bcebos.com/imgs/DWEqdA.png)

##### 1. 安装 mit

```jsx
npm install mitt -S
```

##### 2. 创建公共的 EventBus 模块

在项目中创建公共的 eventBus 模块如下：

```jsx
// 创建一个文件 eventBus.js

import mitt from "mitt";
const bus = mitt();

export default bus; // 把创建的EventBus的实例共享出去
```

##### 3. 在数据接收方自定义事件

在数据接收方，调用 bus.on(’事件名称’, 事件处理函数） 方法注册一个自定义事件。

```jsx
import bus from './eventBus.js'

export default {
    data() { return {count: 0} },
    created() {
        bus.on('countChange', (count) => {
            this.count = count;
        }
    },
}
```

##### 4. 在数据发送方触发事件

在数据发送方，调用 bus.emit(’事件名称’，要发送的数据) 方法触发自定义事件。

```jsx
import bus from "./eventBus.js";

export default {
  data() {
    return { count: 0 };
  },
  methods: {
    addCount() {
      this.count++;
      bus.emit("countChange", this.count);
    },
  },
};
```

#### 后代关系组件之间的数据共享

可以使用 provide 和 inject 实现后代组件之间的数据共享。

![5QQbjj](http://timpcfan-site.cdn.bcebos.com/imgs/5QQbjj.png)

![dM8Wma](http://timpcfan-site.cdn.bcebos.com/imgs/dM8Wma.png)

上述的方法不是响应式的，改变了父组件的值，子孙组件没有变化，要使用 computed 函数修改：

![WLpXE4](http://timpcfan-site.cdn.bcebos.com/imgs/WLpXE4.png)

![gPCKax](http://timpcfan-site.cdn.bcebos.com/imgs/gPCKax.png)

#### vuex——终极的组件之间数据共享方案

vuex 可以让组件之间的数据共享变得高效、清晰、且易于维护。

![0HtmYq](http://timpcfan-site.cdn.bcebos.com/imgs/0HtmYq.png)

创建一个共享的 store，存取数据都通过 store，实现不同组件之间的数据共享。

### vue3.x 中全局配置 axios

#### 为什么要全局配置 axios？

1. 每个组件中都需要导入 axios 包（代码臃肿）
2. 没吃发请求都需要填写完整的请求路径（不利于后期的维护）

#### 如何全局配置 axios？

![CwAmsY](http://timpcfan-site.cdn.bcebos.com/imgs/CwAmsY.png)

```jsx
// main.js

import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import axios from "axios";

const app = createApp(App);

axios.defaults.baseURL = "https://timpcfan.site";
app.config.globalProperties.$http = axios; // 这里的 $http 为自己取的名字，可以在组件中通过 this.$http 访问**

app.mount("#app");
```

### ref 的使用

ref 是用于辅助开发者获得 DOM 元素或者组件的引用的。（不建议使用 jQuery 获取 DOM 元素，建议使用 ref）

#### 使用 ref 获取 DOM 元素

vue 在每个组件的引用中(this)都添加了一个`$refs`的属性，这个属性默认指向一个空对象，若开发者需要获取某个 DOM 元素，可以为该 DOM 元素添加属性 `ref=”name1”`，则可以使用 `this.$refs.name1` 获取该 DOM 元素的引用。

```jsx
<template>
    <div>
        <h1 ref="myh1">lalala</h1>
    </div>
</template>

<script>
export default {
    methods: {
        getRefs() {
            console.log(this.$refs.myh1);
        },
    },
}
</script>
```

#### 使用 ref 引用组件实例

```jsx
<!-- 给组件添加属性 ref -->
<my-counter ref="counterRef"></my-counter>

console.log(this.$refs.counterRef);
this.$refs.counterRef.add();
```

#### 要引用的对象还没有渲染怎么办？使用 $.nextTick(callback) 方法

组件的 `$nextTick(cb)` 方法，会把 cb 回调推迟到下一个 DOM 更新周期之后执行。

```jsx
<input type="text" v-if="inputVisible" ref="ipt">
<button v-else @click="showInput">展示input输入框</button>

methods: {
    showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
            this.$refs.ipt.focus(); // 若不使用 $nextTick 则找不到这个 ipt
        })
    }
}
```

### 动态组件

::: info
动态组件指的是动态切换组件的显示和隐藏。vue 提供了一个内置的`<component>` 组件，专门用来实现组件的动态渲染。

:::

1. `<component>` 是组件的占位符
2. 通过 is 属性动态指定要渲染的组件名称
3. `<component is=”要渲染的组件的名称”></component>`

#### 使用 keep-alive 保持组件状态

使用`<component>`时，若切换成其他组件，则原本的组件将会被销毁，其状态无法保持，可以使用`<keep-alive>`标签将`<component>`进行包裹，以保持切换走的组件的状态。

```jsx
<keep-alive>
    <component :is="comName"></component>
</keep-alive>
```

### 插槽

::: info
插槽（Slot）是 vue 为组件的封装者提供的能力。允许开发者在封装组件时，把**不确定的、希望用户指定的部分**定义为插槽。

:::

![vZewR9](http://timpcfan-site.cdn.bcebos.com/imgs/vZewR9.png)

可以把插槽认为是组件封装期间，为用户预留的**内容的占位符**。

#### 插槽的基础用法

在封装组件时，可以通过`<slot>`元素定义插槽，在使用时组件标签包裹的内容将会插入到插槽中。

```jsx
<template>
    <p>这是组件MyCom1的第一个p标签</p>
    <slot></slot>
    <p>这是组件MyCom1的第二个p标签</p>
</template>

<MyCom1>
    <p>这是用户自定义的内容</p>
</MyCom1>
```

::: info
若没有定义插槽，则组件包裹的任何内容都会被丢弃。

:::

#### 插槽的后备内容

通过`<slot>`元素定义插槽时，可以在其中定义后备内容，若用户未提供自定义内容，则显示后备内容。

#### 具名插槽

如果在封装组件时需要预留多个插槽节点，则需要为每个`<slot>`插槽指定具体的 name 名称。这种带有具体名称的插槽叫做“具名插槽”。

![nWdPi4](http://timpcfan-site.cdn.bcebos.com/imgs/nWdPi4.png)

::: info
没有 name 名称的插槽会有隐含的名称叫做“default”

:::

![eGacvB](http://timpcfan-site.cdn.bcebos.com/imgs/eGacvB.png)

::: info
`v-slot:`可以简写为`#`，即`v-slot:header` → `#header`

:::

#### 作用域插槽

![I0YDN5](http://timpcfan-site.cdn.bcebos.com/imgs/I0YDN5.png)

省略了插槽的 props 属性的介绍，有缘再见吧。

### 自定义指令

vue 官方提供了 v-for, v-model 等常用的内置指令。除此之外，vue 还允许开发者自定义指令。

我想省略了 orz。

## vue 路由

### 前端路由的概念与原理

路由就是**对应关系**。路由分为两大类：

1. 后端路由：后端路由指的是**请求方法、请求地址**与**function 处理函数**之间的**对应关系**。
2. 前端路由：前端路由指的是**Hash 地址**与**组件**之间的**对应关系**。

::: info
在 SPA 中，web 网站只有唯一的一个 HTML 页面，**所有组件的展示与切换**都在这为一的一个页面内完成。此时，**不同组件之间的切换**需要通过**前端路由**来实现。

:::

#### 前端路由的工作方式

1. 用户点击了页面上的路由地址
2. 导致了 URL 地址栏中的 Hash 值发生了变化
3. 前端路由监听到了 Hash 地址的变化
4. 前端路由把当前 Hash 地址对应的组件渲染到浏览器中

![HbwSnR](http://timpcfan-site.cdn.bcebos.com/imgs/HbwSnR.png)

#### 实现简易的前端路由

1. 导入并注册 MyHome、MyMovie、MyAbout 三个组件：

```jsx
export default {
  components: {
    MyHome,
    MyMovie,
    MyAbout,
  },
};
```

2. 通过`<component>`标签的 is 属性，动态切换要显示的组件：

```jsx
<component :is="comName"></component>

data() {
    return {
        comName: 'my-home',
    }
}
```

3. 在组件的结构中声明如下 3 个`<a>`连接，通过点击不同的`<a>`连接，切换浏览器地址栏中的 Hash 值：

```jsx
<a href="#/home">Home</a> & nbsp;
<a href="#/movie">Movie</a> & nbsp;
<a href="#/about">About</a> & nbsp;
```

4. 在 created 生命周期函数中监听浏览器地址栏中 Hash 地址的变化，动态切换要展示的组件的名称：

```jsx
created() {
    window.onhashchange = () => {
        switch (location.hash) {
            case '#/home':
                this.comName = 'my-home',
                break
            case '#/movie':
                this.comName = 'my-movie',
                break
            case '#/about':
                this.comName = 'my-about',
                break
        }
    }
}
```

### vue-router 的基本使用

::: info
vue-router 是 vue 官方给出的路由解决方案。它只能结合 vue 项目进行使用，能够轻松的管理 SPA 项目中组件的切换。

:::

- vue-router 3.x：对应 vue2.x ：[https://router.vuejs.org/zh](https://router.vuejs.org/zh)
- vue-router 4.x：对应 vue 3.x ：[https://next.router.vuejs.org](https://next.router.vuejs.org)

#### vue-router4.x 的基本使用步骤

- **在项目中安装 vue-router**
  ```jsx
  npm install vue-router@next -S
  ```
- **定义路由组件**
  就是定义自己的组件，如 MyHome.vue, MyMovie.vue, MyAbout.vue
- **声明路由链接与占位符**
  可以使用`<router-link>`标签来声明路由链接，并使用`<router-view>`标签来声明路由占位符。

  ```jsx
  <template>
    <h1> App 组件 </h1>
    <!-- 声明路由链接 -->
    <router-link to="/home">首页</router-link> <!-- 不需要加井号啦 -->
    <router-link to="/movie">电影</router-link>
    <router-link to="/about">关于</router-link>

    <!-- 声明路由占位符 -->
    <router-view></router-view>
  </template>
  ```

- **创建路由模块**
  在项目中创建 router.js 路由模块，在其中按照如下 4 个步骤创建并得到路由的实例对象：

  1. 从 vue-router 中按需导入两个方法
  2. 导入需要使用路由控制的组件
  3. 创建路由实例对象
  4. 向外共享路由实例对象
  5. 在 main.js 中导入并挂载路由模块

  ```jsx
  import { createRouter, createWebHashHistory } from 'vue-router'  // 1.

  import MyHome from './MyHome.vue'  // 2.
  import MyMovie from './MyMovie.vue'
  import MyAbout from './MyAbout.vue'

  const router = createRouter({  // 3.
    history: createWebHashHistory(),
    routes: [
        { path: '/home', component: MyHome },
        { path: '/movie', component: MyMovie },
        { path: '/about', component: MyAbout },
  })

  export default router;  // 4.
  ```

- 导出并挂载路由模块
  ```jsx
  // main.js
  // ...
  import router from "./router";
  const app = createApp(App);
  app.use(router); // 5.
  app.mount("#app");
  ```

### vue-router 的高级用法

#### 路由重定向

::: info
路由重定向指的是：用户在访问地址 A 的时候，强制用户跳转到地址 C，从而展示特定的组件页面。

:::

通过路由规则的 redirect 属性，指定一个新的路由地址，可以很方便地设置路由的重定向：

```jsx
const router = createRouter({  // 3.
    history: createWebHashHistory(),
    routes: [
        { path: '/', **redirect: '/home'** },
        { path: '/home', component: MyHome },
        { path: '/movie', component: MyMovie },
        { path: '/about', component: MyAbout },
})
```

#### 为激活的路由链接设置高亮样式

1. **默认的高亮 class 类**：被激活的路由链接，默认会应用一个叫做 router-link-active 的类名。开发者可以使用此类名选择器，为激活的路由链接设置高亮样式：

   ```css
   /* index.css */
   .router-link-active {
     background-color: red;
     color: white;
     font-weight: bold;
   }
   ```

2. **自定义路由高亮的 class 类**：开发者可以基于 linkActiveClass 属性，自定义路由链接被激活时所应用的类名：

   ```jsx
   const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: 'router-active',
    routes: [
        { path: '/', **redirect: '/home'** },
        { path: '/home', component: MyHome },
        { path: '/movie', component: MyMovie },
        { path: '/about', component: MyAbout },
   })
   ```

#### 嵌套路由

通过路由实现组件的嵌套展示，叫做嵌套路由。

![um5ec9](http://timpcfan-site.cdn.bcebos.com/imgs/um5ec9.png)

1. 声明子路由链接和子路由占位符（声明在子组件内部即可）

   ```jsx
   <template>
     <div>
       <h3>MyAbout 组件</h3>

       <router-link to="/about/tab1">Tab1</router-link>
       <router-link to="/about/tab2">Tab2</router-link>

       <router-view></router-view>
     </div>
   </template>
   ```

2. 在父路由规则中，通过 children 属性嵌套声明子路由规则

   ```jsx
   const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: 'router-active',
    routes: [
        { path: '/', **redirect: '/home'** },
        { path: '/home', component: MyHome },
        { path: '/movie', component: MyMovie },
        {
            path: '/about',
            component: MyAbout,
            **redirect: '/about/tab1',** // 访问 /about 时就直接显示 tab1
            **children: [
                { path: 'tab1', component: Tab1 },** // 访问 /about/tab1 时展示 Tab1
                **{ path: 'tab2', component: Tab2 },
            ],**
        },
   })
   ```

#### 动态路由匹配

::: info
动态路由指的是：把 Hash 地址中的**可变部分**定义为**参数项**，从而提高路由规则的可复用性。

:::

在 vue-router 中使用英文的冒号（:）来定义路由的参数：

```jsx
{ path: '/movie/:id', component: Movie }

{ path: '/movie/1', component: Movie }
{ path: '/movie/2', component: Movie }
{ path: '/movie/3', component: Movie }
```

使用 `$route.params` 对象获取动态匹配的参数值。

```jsx
<template>
    <h1> id：{{ $route.params.id }} </h1>
</template>
```

使用 `props` 接收路由参数，需要在路由规则中开启：

```jsx
{ path: '/movie/:id', component: Movie, **props: true** }

<template>
    <h1> id：{{ id }} </h1>
</template>

export default {
    name: 'MyMovie',
    props: ['id'],
}
```

#### 编程式导航

::: info
编程式导航 vs 声明式导航：通过调用 API（调用 location.href）实现导航的方式叫做编程式导航，而通过点击链接（a 标签）实现导航的方式称为声明式导航。

:::

**vue-router 中的编程式导航 API**

- this.$router.push(’hash 地址’)：跳转到指定的 hash 地址
- this.$router.go(数值 n)：实现导航历史的前进、后退（-1）

```jsx
gotoMovie(id) {
    this.$router.push(`/movie/${id}`);
}
```

#### 命名路由

通过 name 属性为路由规则定义名称的方式，叫做命名路由：

```jsx
{
    path: '/movie/:id',
    name: 'mov',
    component: Movie,
    props: true,
}
```

注意：命名路由的 name 值不能重复。

使用命名路由可以在`<router-link>`中直接使用其名称，而不用显示地写 hash 地址：

```jsx
<router-link :to="{ name: 'mov', params: { id: 3 } }">go to Movie</router-link>

this.$router.push({
    name: 'mov',
    params: { id: 3 },
})
```

#### 导航守卫

导航守卫可以控制路由的访问权限。

![iSrYhO](http://timpcfan-site.cdn.bcebos.com/imgs/iSrYhO.png)

### 如何声明全局导航守卫

**全局导航守卫**会**拦截每个路由规则**，从而对每个路由进行**访问权限**的控制。可以按照如下的方式定义全局导航守卫：

```jsx
// 创建路由实例对象
const router = createRouter({ ... })

// 调用路由实例对象的 beforeEach 函数，声明“全局前置守卫”
// fn 必须是一个函数，每次拦截到路由的请求，都会调用 fn 进行处理
// 因此 fn 叫做 “守卫方法”
router.beforeEach(fn)
```

#### 守卫方法的 3 个参数

全局导航守卫的守卫方法中接收 3 个形参，格式为：

```jsx
router.beforeEach((to, from, next) => {
  // to 目标路由对象
  // from 当前导航要离开的路由对象
  // next 时一个函数，表示放行
});
```

::: info
如果不接收第 3 个形参，则默认允许用户访问每一个路由。如果接收了 next 形参，则必须调用 next()函数，否则不允许用户访问该路由。

:::

next 函数的 3 种调用方式：

- 直接放行：next()
- 强制其停留在当前页面：next(false)
- 强制其跳转到登录页面：next(’/login’)

#### 结合 token 控制后台主页的访问权限

```jsx
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token"); // 1. 读取 token
  if (to.path === "/main" && !token) {
    // 2. 想要访问“后台主页”，且 token 不存在
    // next(false);  // 3.1 不允许跳转
    next("/login"); // 3.2 强制跳转到“登录页面”
  } else {
    next(); // 3.3 直接放行，允许访问“后台主页”
  }
});
```

## vue 项目的创建

### 如何快速创建 vue 的 SPA 项目

1. 基于 vite 创建 SPA 项目
   - 仅支持 3.x
   - 不基于 webpack
   - 速度快
   - 小而巧
2. 给予 vue-cli 创建 SPA 项目
   - 支持 2.x 与 3.x
   - 基于 webpack
   - 较慢
   - 大而全

```bash
npm init vite-app code1  # 创建一个vite项目，命名为code1
cd code1
npm install  # 安装依赖包
npm run dev  # 启动项目
```

### vite 的基本使用

![ZG3kP3](http://timpcfan-site.cdn.bcebos.com/imgs/ZG3kP3.png)

![yITax7](http://timpcfan-site.cdn.bcebos.com/imgs/yITax7.png)

#### vite 项目的运行流程

在工程化的项目中，vue 要做的事情很单纯：通过 `main.js` 把 `App.vue` 渲染到 `index.html` 的指定区域中。

其中：

1. `App.vue` 用来编写待渲染的模板结构
2. `index.html` 中需要预留一个 `el` 区域
3. `main.js` 把 `App.vue` 渲染到了 `index.html` 所预留的区域中

#### App.vue

```jsx
// 需要使用<template>标签把组件包围
<template>
  <h1>hello world</h1>
</template>
```

#### main.js

```jsx
// 1. 按需导入 createApp 函数
import { createApp } from "vue";
// 2. 导入待渲染的 App.vue 组件
import App from "./App.vue";

// 3. 调用 createApp 函数，创建 SPA 应用的实例
const app = createApp(App);

// 4. 调用 mount() 把 App 组件的模版结构，渲染到指定的 el 区域中
app.mount("#app");
```

[Todos - Vite 项目案例](todos.md)

### vue-cli 的使用

[Vue CLI](http://cli.vuejs.org/zh)

#### 基于 vue ui 创建 vue 项目

1. 运行 `vue ui` 命令，自动在浏览器中打开创建项目的可视化面板。

![CALMwI](http://timpcfan-site.cdn.bcebos.com/imgs/CALMwI.png)

2. 填写项目名称
3. 在预设页面选择手动配置项目

![xHZnib](http://timpcfan-site.cdn.bcebos.com/imgs/xHZnib.png =x300)

4. 在功能页面勾选需要安装的功能

![rwl84Y](http://timpcfan-site.cdn.bcebos.com/imgs/rwl84Y.png)

5. 在配置页面勾选 vue 的版本和需要的预处理器

![cl0cMR](http://timpcfan-site.cdn.bcebos.com/imgs/cl0cMR.png)

![WSUYun](http://timpcfan-site.cdn.bcebos.com/imgs/WSUYun.png)

#### 基于命令行创建 vue 项目

```jsx
vue create my-project
```

## vue 组件库

### 什么是 vue 组件库

在实际开发中，前端开发者可以把自己封装的.vue 组件整理、打包、并发布为 npm 的包，从而供其他人下载和使用。这种可以直接下载并在项目中使用的现成组件，就叫做 vue 组件库。

### vue 组件库与 bootstrap 的区别

- bootstrap 只提供了纯粹的原材料（css 样式、HTML 结构以及 JS 特效），需要由开发者做进一步的组装和改造。
- vue 组件库是遵循 vue 语法、高度定制的现成组件，开箱即用的。

### 最常用的 vue 组件库

- PC 端
  - Element UI
  - View UI
- 移动端
  - Mint UI
  - Vant

### Element UI

::: tip
是由饿了么前端团队开源的一套 PC 端 vue 组件库。

:::

- vue2 使用旧版的 Element UI
- vue3 使用新版的 [Element Plus](https://element-plus.gitee.io/zh-CN/guide/design.html)

#### 安装

```jsx
npm install element-plus --save
```

#### 引入 element-ui

- 完整引入：操作简单，但体积过大
- 按需引入：操作复杂，优化体积

##### 完整引入

```jsx
// main.ts
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(ElementPlus);
app.mount("#app");
```

##### 按需引入

自动导入（推荐）

```jsx
npm install -D unplugin-vue-components unplugin-auto-import

// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  // ...
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
}

**// 或者对于vue-cli项目，修改vue.config.js**
const { defineConfig } = require("@vue/cli-service");

const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
});
```

手动导入（不推荐就不写啦）

## axios+vue

- axios 回调函数中的 `this` 已经改变，无法访问到 `data` 中数据
- 把 `this` 保存起来，回调函数中直接使用保存的 `this` 即可

```jsx
var app = new Vue({
  el: "#app",
  data: {
    joke: "lala",
  },
  methods: {
    getJoke: function () {
      var that = this; // 这里先保存this，在回调函数中this将会变化
      axios.get("https://autumnfish.cn/api/joke").then(function (response) {
        that.joke = response.data; // 这里的this已经变化，使用事先保存的that
      });
    },
  },
});
```

### 配置全局 axios

vue2.x

```jsx
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "@picocss/pico/css/pico.min.css"

Vue.config.productionTip = false

**// 全局配置axios
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8080';
Vue.prototype.$axios = axios;**

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### 解决跨域问题

- 使用一个代理服务器来解决跨域问题（这个代理服务器部署在 vue 相同的端口）
- 将 baseURL 改为 vue 项目的运行地址，因此不存在跨域
- 当 vue 发现请求的接口不存在，把请求转交给 proxy 代理
- 代理把请求的根路径替换为 devServer.proxy 属性的值，发起真正的请求
- 代理把请求到的数据，转发给 axios

```jsx
**axios.defaults.baseURL = 'http://localhost:8080';  // baseURL设置为vue的服务器地址**
```

```jsx
// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  **devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9012',  // 这里才是真正的api域名
        changeOrigin: true,
        pathRewrite:{  // 路径重写，
          '^/api': '/api'  // 把 /api 替换成 /api，也就是不替换！
        }
      }
    }
  }**
})
```

![1Ku8ff](http://timpcfan-site.cdn.bcebos.com/imgs/1Ku8ff.png)

## 部署 vue 项目到 docker

[Deployment | Vue CLI](https://cli.vuejs.org/guide/deployment.html#docker-nginx)

## 设置 HTTPS

vue.config.js

```jsx
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: {
      cert: "/Users/timpcfan/cert/localhost.pem",
      key: "/Users/timpcfan/cert/localhost-key.pem",
    },
    proxy: {
      "/api": {
        target: "https://localhost:9012",
        changeOrigin: true,
        pathRewrite: {
          // 路径重写，
          "^/api": "/api", // 把 /api 替换成 /api
        },
      },
    },
  },
});
```

## 问题收集

### props 属性是只读的不能使用 v-model 怎么办？

[https://b23.tv/P8YRl6W](https://b23.tv/P8YRl6W)

把它转存到 data 中，data 中的数据是可读可写的。

## 案例收集

### 计数器

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>基础</title>
  </head>
  <body>
    <div id="app">
      <button @click="sub">-</button>
      <span v-text="count"></span>
      <button @click="add">+</button>
    </div>
    <script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
    <script>
      var app = new Vue({
        el: "#app",
        data: {
          count: 0,
        },
        methods: {
          add: function () {
            if (this.count < 10) {
              this.count++;
            } else {
              alert("已达到最大值");
            }
          },
          sub: function () {
            if (this.count > 0) {
              this.count--;
            } else {
              alert("已达到最小值");
            }
          },
        },
      });
    </script>
  </body>
</html>
```

### 图片切换

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>图片切换</title>
  </head>
  <body>
    <div id="app">
      <span v-text="title"></span><button @click="nextImg">NEXT</button><br />
      <img :src="imgList[curIdx]" />
    </div>
    <script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
    <script>
      var app = new Vue({
        el: "#app",
        data: {
          title: "",
          curIdx: 0,
          imgList: [
            "https://images.unsplash.com/photo-1546508428-f76b668cc812?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1222&q=80",
            "https://images.unsplash.com/photo-1546417492-0e81e5e9d161?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1546884680-a1de22e94d50?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1544946632-b73cacef16ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
            "https://images.unsplash.com/photo-1548561711-73eae96ad48d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=991&q=80",
            "https://images.unsplash.com/photo-1545557800-740d9fe3524a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1540202404-d0c7fe46a087?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80",
            "https://images.unsplash.com/photo-1548604303-af502df13131?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          ],
        },
        methods: {
          nextImg: function () {
            this.curIdx = (this.curIdx + 1) % this.imgList.length;
            console.log(this.curIdx);
          },
        },
      });
    </script>
  </body>
</html>
```

### 记事本

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>记事本</title>
  </head>
  <body>
    <div id="app">
      <h1>记事本</h1>
      <input type="text" v-model="taskName" @keyup.enter="addTask" />
      <ul>
        <li v-for="(item, idx) in taskList">
          {{idx+1}}. {{item}}<button @click="removeTask(idx)">x</button>
        </li>
      </ul>
      <span v-if="taskList.length>0"
        >{{taskList.length}} items left
        <button @click="clearAll">Clear</button></span
      >
    </div>
    <script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
    <script>
      var app = new Vue({
        el: "#app",
        data: {
          taskName: "",
          taskList: [],
        },
        methods: {
          addTask: function () {
            this.taskList.push(this.taskName);
            this.taskName = "";
          },
          removeTask: function (id) {
            this.taskList.splice(id, 1);
          },
          clearAll: function () {
            this.taskList = [];
          },
        },
      });
    </script>
  </body>
</html>
```
