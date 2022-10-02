import { navbar } from "vuepress-theme-hope";

// 精选图标：https://vuepress-theme-hope.github.io/v2/zh/guide/interface/icon.html#iconfont-%E7%B2%BE%E9%80%89%E5%9B%BE%E6%A0%87
export default navbar([
  { text: "主页", icon: "home", link: "/" },
  {
    text: "随笔",
    icon: "note",
    link: "/note/",
    activeMatch: "^/note/",
  },
  {
    text: "生活",
    icon: "flower",
    link: "/life/",
    activeMatch: "^/life/",
  },
  {
    text: "学习笔记",
    icon: "edit",
    children: [
      {
        text: "开发笔记",
        icon: "code",
        prefix: "/code/",
        children: [
          { text: "开发笔记", icon: "code", link: "", activeMatch: "^/code/$" },
          {
            text: "编程语言",
            icon: "language",
            link: "language/",
            activeMatch: "^/code/language/$",
          },
          {
            text: "前端开发",
            icon: "template",
            link: "frontend/",
            activeMatch: "^/code/frontend/$",
          },
          {
            text: "后端开发",
            icon: "module",
            link: "backend/",
            activeMatch: "^/code/backend/$",
          },
          {
            text: "系统设计",
            icon: "structure",
            link: "system-design/",
            activeMatch: "^/code/system-design/$",
          },
        ],
      },
      {
        text: "算法笔记",
        icon: "rank",
        prefix: "/algo/",
        children: [{ text: "算法笔记", icon: "rank", link: "", activeMatch: "^/algo/$" }],
      },
    ],
  },
  {
    text: "杂项",
    icon: "any",
    prefix: "/random/",
    children: ["freq_urls"],
  },
]);
