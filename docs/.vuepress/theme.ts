import { path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";
import { sidebarSorter } from "./sidebar/sidebarSorter";

export default hopeTheme({
  //主题选项
  //https://vuepress-theme-hope.github.io/v2/zh/config/theme/layout.html
  hostname: "https://timpcfan.site",

  author: {
    name: "TrystanLei",
    url: "https://timpcfan.site",
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

  docsDir: "docs/",

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
  // sidebarSorter: ["readme", "order", "title", "date-desc"],
  sidebarSorter: sidebarSorter,

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
    description: "汇聚点滴，凝聚成溪",
    intro: "/intro.html",
    roundAvatar: true,
    medias: {
      Gitee: "https://gitee.com/timpcfan/",
      GitHub: "https://github.com/timpcfan",
      即刻: ["https://okjk.co/35j8Zv", path.resolve(__dirname, "icons/okjk.svg")],
      Twitter: "https://twitter.com/timpcfan",
      Telegram: ["https://t.me/timpcfan", path.resolve(__dirname, "icons/telegram.svg")],
      Email: "mailto:lztsmail@gmail.com",
      RSS: "https://timpcfan.site/rss.xml",
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
      imageSize: true,
    },
  },
});
