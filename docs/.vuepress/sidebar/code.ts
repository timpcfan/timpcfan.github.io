import { arraySidebar } from "vuepress-theme-hope";

// 精选图标：https://vuepress-theme-hope.github.io/v2/zh/guide/interface/icon.html#iconfont-%E7%B2%BE%E9%80%89%E5%9B%BE%E6%A0%87
export const code = arraySidebar([
  "",
  {
    text: "编程语言",
    link: "language/",
    prefix: "language/",
    children: ["java/", "python/", "js/"],
  },
  {
    text: "前端开发",
    link: "frontend/",
    prefix: "frontend/",
    children: ["vue/"],
  },
  {
    text: "后端开发",
    link: "backend/",
    prefix: "backend/",
    children: [],
  },
  {
    text: "系统设计",
    link: "system-design/",
    prefix: "system-design/",
    children: [],
  },
]);
