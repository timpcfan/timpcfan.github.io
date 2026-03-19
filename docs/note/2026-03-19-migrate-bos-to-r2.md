---
title: 2026/03/19 - 把个人网站的对象存储从 BOS 迁到 R2
date: 2026-03-19
isOriginal: true
category:
  - 随笔
tag:
  - 建站
  - R2
  - 对象存储
  - Cloudflare
---

今天想着要继续整理一下我的个人网站，因为网站已经有几年没有动了，上面的图片全部都裂开了。

这些图片之前是存在百度云 BOS 这个对象存储里面的。但因为要付费，可能我账号余额不足了，就不能访问了。我本来以为这些图片都没了，因为太久没用了。但今天心血来潮，打开百度云控制台发现图片还在，只不过不能通过公网访问，需要额外付费。

我还挺欣慰的，虽然这些图片没有什么太大价值，但感觉我这个历史博客的图片还保留着，我就想要把它给迁移回来。

我跟我的小助手派蒙（我的openclaw叫派蒙啦）讨论了一下如何低成本地使用这些图传，他给我推荐了 Cloudflare 的 R2 对象存储，每个月都有一定的免费额度，对于我这种个人网站的资源规模来说绝对够用。

我就让他帮我把 Cloudflare R2 申请下来。因为我的域名本来就是托管在 Cloudflare 上面，所以我很自然地开通了服务，并且把 token 给了她。

派蒙很好地操作 Cloudflare 完成了两件事：
1. 配置图传域名：用我现有的域名作为图传域名 img.timpcfan.com/xxx。
2. 迁移与替换：把我之前存在百度云 BOS 上面的图片从控制台批量下载下来，重新上传到 R2，然后把我个人网站中所有的图传链接都替换成了 Cloudflare R2 对应的链接。

<img width="785" height="568" alt="image" src="https://github.com/user-attachments/assets/9d11c923-34e2-4adc-b582-b180df7bfed7" />
<img width="737" height="537" alt="image" src="https://github.com/user-attachments/assets/e156eddb-dc0a-411f-9243-db72f73c0bd3" />
<img width="750" height="521" alt="image" src="https://github.com/user-attachments/assets/52f99bbb-afdd-434e-82a4-a61f77dde783" />
<img width="760" height="637" alt="image" src="https://github.com/user-attachments/assets/5c6ae292-fcd3-4b00-96bd-06cdcaf27f86" />

我就说了一下我的想法，然后他就这么水灵灵地一气呵成把事情给做完了，我真的挺震撼的。在以前，如果要我手动做这个事情，我可能就放弃了，让网站一直图裂下去吧，who cares?

现在遇到了什么问题，好像都能让派蒙给我指导一下，或者直接帮我去做，这种体验真的很奇妙。就像你雇佣了一个黑客一样，他可以做到很多你想不到的事情。你只要把你的想法讲出来，他都能通过某种方式来完成，而且不辞辛劳。真的感谢我的小派蒙，感谢这个充满奇迹的时代。

<img width="775" height="436" alt="image" src="https://github.com/user-attachments/assets/18bb4b9a-fa74-4025-a8ca-6fe5c92ebaa4" />
其实这个博客本来我是让派蒙帮我顺便写的，但是感觉不是自己写的还是挺有罪恶感的hhh，还是重新自己再写一遍😂
