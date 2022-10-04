---
title: 前端工程化与Webpack
icon: discover
order: 10
category:
  - 笔记
  - 前端
tag:
  - 前端
  - webpack
---

## 前端工程化

::: tip 前端工程化的四个「现代化」

- 模块化（js 的模块化，css 的模块化，资源的模块化）
- 组件化（复用现有的 UI 结构，样式，行为）
- 规范化（目录结构的画风，编码规范化，接口规范化，文本规范化， Git 分支管理）
- 自动化（自动化构建，自动部署，自动化测试）

:::

### 什么是前端开发工程化？

在企业级的前端项目开发中，把前端开发所需的工具、技术、流程、经验等进行规范化、标准化。

企业中的 Vue 项目和 React 项目，都是基于工程化的方式开发的。

### 前端工程化的解决方案

目前流行的：

- [webpack](http://www.webpackjs.com)
- [parcel](http://zh.parceljs.org)

## webpack

::: tip
webpack 是前端项目工程化的具体解决方案，它提供了友好的**前端模块化开发**支持，以及**代码压缩混淆**、**处理浏览器端 JavaScript 的兼容性**、**性能优化**等强大的功能。

:::

### 创建一个 npm 的项目

```bash
npm init -y  # 生成配置文件package.json
```

### 在项目中安装 webpack

```bash
npm i webpack@5.42.1 webpack-cli@4.7.2 -D
```

其中，`-D` 表示 `--save-dev`，将安装的包写入 `devDependencies` 中，表示开发时才会被利用到。默认为 `-S` 表示 `--save` ，将安装的包写入 `depedencies` 中，表示在开发以及生产环境中都会被用到。

### 在项目中配置 webpack

1. 在项目根目录中，创建名为 `webpack.config.js` 的 webpack 配置文件，并初始化如下的基本配置：

```jsx
// 使用 Node.js 中的导出语法，向外导出一个 webpack 的配置对象
module.exports = {
  // 代表 webpack 运行的模式，可选值为 development、production
  mode: "development",
};
```

2. 在 `package.json` 的 `scripts` 节点下，新增 dev 脚本如下：

```jsx
"scripts": {
	"dev": "webpack",  // script 节点下的脚本，可以通过 npm run 执行，例如 npm run dev
  "build": "webpack --mode=production"  // 生产模式打包
}
```

3. 在终端中运行 `npm run dev` 命令，启动 webpack 进行项目的打包构建

::: tip
webpack 会将所有依赖的 js 文件都整合到一个 main.js 文件中，在 html 中应该直接引用整合后的 main.js 文件。

:::

### webpack 中的默认约定

在 webpack4.x 和 5.x 的版本中，有如下的默认约定：

1. 默认的打包入口文件为：src→index.js
2. 默认的输出文件路径为：dist→main.js

::: tip
注：可在 `webpack.config.js` 中修改打包的默认约定

通过 entry 节点指定打包的入口，通过 output 节点指定打包的出口。

:::

```jsx
const path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
  },
};
```

## webpack 插件的使用

### 一些常用的插件

1. **webpack-dev-server**
   - 每当修改了源代码，webpack 会自动进行项目的打包和构建
2. **html-webpack-plugin**
   - webpack 中的 HTML 插件（类似于一个模板引擎插件）
   - 可以通过此插件自定义 index.html 页面的内容
   - 插件生成的 html 页面中会自动注入了打包的 main.js 文件

### 如何使用**webpack-dev-server**

安装

```bash
npm i webpack-dev-server -D
```

修改 `package.json` 中的 `scripts` 的 `dev` 命令如下：

```json
"scripts": {
  "dev": "webpack **serve**"
},
```

再次运行 `npm run dev` 命令，重新进行项目的打包

在浏览器中访问：[http://localhost:8080](http://localhost:8080) 地址，查看自动打包效果

::: info 一些坑

- 该插件自动打包生成的 js 文件是存储在内存中的，因此在物理磁盘路径下无法看见
- 该插件生成的 js 文件默认的位置是项目的根目录

:::

### 如何使用 html-webpack-plugin

::: info
为什么要用 html-webpack-plugin？

使用上面的插件时，访问 http://localhost:8080 地址，默认是打开根目录，但实际的项目入口在 src 文件夹中，因此希望将 src 文件夹中的 index.html 复制一份到根目录下，使得可以直接访问。

:::

安装

```bash
npm i html-webpack-plugin -D
```

配置

```jsx
// 1. 导入 HTML 插件
const HtmlPlugin = require("html-webpack-plugin");

// 2. 创建 HTML 插件的实例对象
const htmlPlugin = new HtmlPlugin({
  template: "./src/index.html", // 指定原文件的路径
  filename: "./index.html", // 指定生成文件的路径
});

module.exports = {
  mode: "development",
  plugins: [htmlPlugin], // 3. 通过 plugins 节点，使 htmlPlugin 插件生效
};
```

::: info 启动时自动打开浏览器

```jsx
module.exports = {
  mode: "development",
  devServer: {
    open: true, // 自动打开浏览器
    host: "127.0.0.1", // 实时打包使用的主机地址
    port: 8080, //实时打包使用的端口号
  },
};
```

:::

### webpack 中的 loader

::: tip
webpack 默认只能处理.js 文件，当遇到其他文件时它会寻找有没有对应的 loader 能够进行处理。例如，在处理 css 文件时，需要安装处理 css 文件的 loader。

:::

安装 loader：

```bash
npm i style-loader css-loader -D
npm i less-loader - D  # 若要处理less文件
npm i url-loader file-loader -D # 若要处理图片
npm i babel-loader @babel/core @babel/plugin-proposal-decorators -D # 处理高级js语法
```

在 `webpack.config.js` 的 `module->rules` 数组中，添加 loader 规则如下：

```jsx
module.exports = {
  module: {
    // 所有第三方文件模块匹配规则
    rules: [
      // 文件后缀名的匹配规则
      { test: /\.css$/, use: ["style-loader", "css-loader"] }, // 允许在js中使用 import 'xxx.css' 的方式导入css
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.jpg|png|gif$/, use: ["url-loader?limit=20000"] }, // 处理图片，小于等于20000字节的会被转换成base64，否则为地址
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ }, // 处理高级js语法，node_modules中的第三方包不需要被打包
    ],
  },
};
```

其中， `test` 表示匹配的文件类型，`use` 表示对应要调用的 loader

::: warning

- use 数组中指定的 loader 顺序是固定的
- 多个 loader 的调用顺序是：**从后往前调用**

:::

#### 配置 babel-loader

不想看了，省略！

要创建一个 `babel.config.js` 文件

### 自动清理 dist 目录

包：clean-webpack-plugin

使用方法：[https://www.npmjs.com/package/clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

### 解决 Source Map 的问题

::: tip
由于 webpack 会进行混淆代码，因此运行时报错的行号可能与源代码的行号不一致，可以使用下面的方法来保持一致：

:::

在配置文件中添加：

```jsx
module.exports = {
  mode: "devlopment",
  devtool: "eval-source-map", // this!
};
```

::: warning
考虑到安全原因，建议使用折衷的 `nonsources-source-map`

:::

### @符号的定义

::: tip
import 时，若使用相对路径会使得代码非常繁琐，可以使用@符号代表 src 目录的绝对路径，从外往里指定路径。

:::

```jsx
module.exports = {
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
};
```
