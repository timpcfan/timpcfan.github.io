import { path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  //主题选项
  //https://vuepress-theme-hope.github.io/v2/zh/config/theme/layout.html
  hostname: "https://timpcfan.github.io",

  author: {
    name: "TrystanLei",
    url: "https://timpcfan.github.io",
  },

  iconAssets: "iconfont",
  logo: "/avatar_self.webp",

  //是否全局启用路径导航
  breadcrumb: true,

  //页面元数据：贡献者，最后修改时间，编辑链接
  contributors: false,
  lastUpdated: true,
  editLink: true,

  //深色模式配置
  //darkmode: "disable",
  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },
  fullscreen: true,

  // 默认为 GitHub. 同时也可以是一个完整的 URL
  repo: "timpcfan/timpcfan.github.io",
  // 自定义仓库链接文字。默认从 `repo` 中自动推断为 "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
  repoLabel: "GitHub",
  // 是否在导航栏内显示仓库链接，默认为 `true`
  repoDisplay: true,

  // docsDir: "demo/src",

  // navbar
  navbar: navbar,
  //导航栏布局
  navbarLayout: {
    left: ["Brand"],
    center: ["Links"],
    right: ["Repo", "Outlook", "Search"],
  },
  //是否在向下滚动时自动隐藏导航栏
  //navbarAutoHide: "always",

  //侧边栏排序规则
  sidebarSorter: ["readme", "order", "title", "date-desc"],
  // sidebar
  sidebar: sidebar,

  footer: '本站原创内容基于 <a class="underline" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> 共享, 转载请注明出处。',

  displayFooter: true,
  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "Word", "ReadingTime", "PageView"],
  //https://vuepress-theme-hope.github.io/v2/zh/config/frontmatter/layout.html#pageinfo
  // pageInfo: ["Author", "Original", "Date", "Category", "Tag", "Word", "ReadingTime"],

  //https://vuepress-theme-hope.github.io/v2/zh/config/theme/feature.html
  blog: {
    articleInfo: ["Date", "Category", "Tag", "ReadingTime", "PageView"],
    name: "TrystanLei",
    avatar: "/avatar_self.webp",
    description: "",
    intro: "/intro.html",
    roundAvatar: true,
    medias: {
      Gitee: "https://gitee.com/timpcfan/",
      GitHub: "https://github.com/timpcfan",
      即刻: [
        "https://okjk.co/35j8Zv",
        '<svg viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image id="image1" x="0" y="0" width="176" height="176" xlink:href="data:image/png;base64, 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"/></svg>',
      ],
      Twitter: "https://twitter.com/timpcfan",
      Telegram: [
        "https://t.me/timpcfan",
        '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
      ],
      RSS: "https://timpcfan.github.io/rss.xml",
    },
  },

  plugins: {
    blog: {
      // 自动摘要
      autoExcerpt: true,
    },

    //评论配置
    comment: {
      //部署 Waline：https://waline.js.org/guide/get-started.html
      provider: "Waline",
      serverURL: "https://waline.timpcfan.site",
      pageview: true,
      //Waline 等级标签
      walineLocales: {
        "/": {
          admin: "站长",
          level0: "锻体",
          level1: "炼气",
          level2: "筑基",
          level3: "金丹",
          level4: "元婴",
          level5: "化神",
        },
      },
      //Giscus 备用配置
      //provider: "Giscus",
      //repo: "rockbenben/LearnData",
      //repoId: "R_kgDOHdfk6Q",
      //category: "Comments",
      //categoryId: "DIC_kwDOHdfk6c4CQYNn",
    },

    mdEnhance: {
      enableAll: false,
      footnote: true,
      tasklist: true,
      mark: true,
      container: true,
      lazyLoad: true,
    },
  },
});
