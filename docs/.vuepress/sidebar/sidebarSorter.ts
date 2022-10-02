import { getSorter } from "vuepress-theme-hope/src/node/prepare/sidebar/sorter";
import { HopeThemeSidebarInfo } from "vuepress-theme-hope/src/shared/options/layout/options";

const defaultSorter = getSorter();
const noteSorter = getSorter(["readme", "date-desc", "order", "title"]);

export const sidebarSorter = function (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) {
  let sidebarSorters = defaultSorter;
  if (infoA.type === "file" && infoB.type === "file") {
    if (infoA.path.match("^\\d{4}-\\d{2}-\\d{2}\\D") && infoB.path.match("^\\d{4}-\\d{2}-\\d{2}\\D")) {
      // 如果是随笔的页面才使用日期降序进行排序（随笔页面文件命名以日期开头）
      infoA.frontmatter = { date: new Date(infoA.path.substring(0, 10)) };
      infoB.frontmatter = { date: new Date(infoB.path.substring(0, 10)) };
      sidebarSorters = noteSorter;
    }
  }
  try {
    for (let i = 0; i < sidebarSorters.length; i++) {
      const result = sidebarSorters[i](infoA, infoB);

      if (result !== 0) return result;
    }
  } catch (error) {
    console.log(infoA, infoB, error);
    return 0;
  }

  return 0;
};
