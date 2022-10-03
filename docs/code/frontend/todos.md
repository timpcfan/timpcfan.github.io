---
title: Todos - Vite 项目案例
icon: any
index: false
article: false
---

## 初始化项目

```bash
npm init vite-app todos
npm install
npm i less -D
```

## 梳理项目结构

1. 重置 `index.css` 中的全局样式：

```css
:root {
  font-size: 12px;
}

body {
  padding: 8px;
}
```

1. 重置 `App.vue` 组件的代码结构为：

```jsx
<template>
  <div>
    <h1>Hello, world</h1>
  </div>
</template>

<script>
export default {
  name: "TodoApp",
  data() {
    return {
      todolist: [
        { id: 1, text: "Learn Vue", done: true },
        { id: 2, text: "Learn Vue Router", done: false },
        { id: 3, text: "Learn Vuex", done: false },
      ],
    };
  },
};
</script>
<style lang="less" scoped></style>
```

2. 删除 `compenents` 目录下的 `HelloWorld.vue` 组件。
3. 在终端运行：

```bash
npm run dev
```

## 封装 todo-list 组件

### 创建并注册组件

1. 创建 `src/components/todo-list/TodoList.vue` 文件。
2. 在 App.vue 中注册该文件。

```java
<template>
  <div>
    <TodoListVue></TodoListVue>
  </div>
</template>

<script>
import TodoListVue from "./components/todo-list/TodoList.vue";
export default {
  name: "TodoApp",
  components: {
    TodoListVue,
  },
  data() {
    return {
      todolist: [
        { id: 1, text: "Learn Vue", done: true },
        { id: 2, text: "Learn Vue Router", done: false },
        { id: 3, text: "Learn Vuex", done: false },
      ],
    };
  },
};
</script>
<style lang="less" scoped></style>
```

### 基于 bootstrap 渲染组件

1. 安装 bootstrap

```bash
npm i bootstrap@4.6.1
```

2. 在 `main.js` 中导入 bootstrap 样式表：

```jsx
import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css"; // 这里没导入 .js
import "./index.css";

createApp(App).mount("#app");
```

3. 根据 bootstrap 提供的列表组与复选框渲染列表组件基本效果

```jsx
<template>
  <div>
    <ul class="list-group">
      <!-- 列表组 -->
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <!-- 复选框 -->
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
          <label class="form-check-label" for="defaultCheck1"> Default checkbox </label>
        </div>
        <!-- 徽标 -->
        <span class="badge badge-success badge-pill">完成</span>
        <span class="badge badge-warning badge-pill">未完成</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "TodoList",
};
</script>
<style lang="less" scoped></style>
```

### 为 TodoList 声明 props 属性

1. 在 `todolist.vue` 中声明 props 属性

```jsx
export default {
  name: "TodoList",
  props: {
    list: {
      type: Array,
      required: true,
      default: [],
    },
  },
};
```

2. 在 `App.vue` 中通过 `list` 属性，将数据传递给 `TodoList` 组件之中：

```jsx
<TodoList :list="todolist"></TodoList>
```

### 渲染列表的 DOM 结构

在 `todolist.vue` 中使用 vue 指令进行渲染列表

```jsx
<template>
  <div>
    <ul class="list-group">
      <!-- 列表组 -->
      <li v-for="item in list" key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
        <!-- 复选框 -->
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="item.done":id="'defaultCheck' + item.id" />
          <label class="form-check-label" :for="'defaultCheck' + item.id"> {{ item.text }} </label>
        </div>
        <!-- 徽标 -->
        <span v-if="item.done" class="badge badge-success badge-pill">完成</span>
        <span v-else class="badge badge-warning badge-pill">未完成</span>
      </li>
    </ul>
  </div>
</template>
```

::: warning
坑：v-for 对应的是 key 属性，而不是 v-key！！！！！报错信息根本看不出来。。

:::
