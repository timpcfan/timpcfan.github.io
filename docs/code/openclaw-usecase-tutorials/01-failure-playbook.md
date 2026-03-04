---
title: 第01课｜失败处理手册：429/fetch/private-IP
date: 2026-03-04
isOriginal: true
category:
  - 技术
  - OpenClaw
tag:
  - OpenClaw
  - Agent
  - 教程
  - 组内分享
  - openclaw-usecase-lesson-01
---

# Lesson 01｜失败是主线：429、fetch failed、private IP blocked 的统一处理

## 核心问题
在真实生产里，“失败”不是异常，而是常态：API 限流、抓取链路被策略拦截、网络环境导致误判、甚至本地命令名都可能不一致。问题不在于是否会失败，而在于：**失败后你能否用同一套剧本把任务救回来，并且把救火经验沉淀成 SOP。**

## 案例（真实）
### 案例 A：Brave 429 + fetch failed + python 命令错误的串联故障
同一条日报链路里同时出现限流、网络失败、工具链缺失，但最终仍完成发送。
- 证据1：sessionKey=agent:main:cron:973684ed-69f4-4938-a6ab-3f99c86aa87d｜2026-03-03T23:15:57.699Z｜quote 摘要："web_search ... 429 ... Request rate limit exceeded"
- 证据2：同 sessionKey｜2026-03-03T23:17:45.227Z｜quote 摘要："command not found: python"
- 证据3（结果回执）：同 sessionKey｜2026-03-03T23:21:02.693Z｜quote 摘要："{ \"ok\": true, ... }"

### 案例 B：web_fetch 被私网 IP 策略拦截后切换抓取链路
定时情报任务中 web_fetch 直接被 guardrail 拦截，但通过 browser 抓取继续推进并最终投递成功。
- 证据1：sessionKey=agent:main:cron:b3c9715e-ee3c-4036-8940-f97e48e405c3｜2026-03-04T00:24:52.026Z｜quote 摘要："web_fetch ... Blocked: resolves to private/internal/special-use IP address"
- 证据2：同 sessionKey｜2026-03-04T00:25:38.298Z｜quote 摘要："browser open ... url=https://www.reuters.com/..."
- 证据3（结果回执）：同 sessionKey｜2026-03-04T00:26:10.499Z｜quote 摘要："{ \"ok\": true, ... }"

## 失败点（错误尝试/反模式）
1) **把不同失败当成不同问题**：429 就临时加 sleep；fetch failed 就“再试一次”；private IP blocked 就换 URL。结果是每次救火都从 0 开始。
2) **只盯一个工具**：web_fetch 失败就死磕 web_fetch；web_search 失败就死磕 Brave。链路缺少“可切换的备胎”。
3) **不做证据化回执**：没有“失败发生在何时/哪层/错误文本”，事后无法复盘，只能凭感觉改。

## 关键转折：把失败“归类”，而不是“逐个击破”
建议把失败按层归类：
- **检索层**：429 / fetch failed（来源发现失败）
- **抓取层**：private IP blocked（内容获取失败）
- **执行层**：command not found（本地处理失败）
- **投递层**：message ok=false（通知失败）

一旦归类，你就能写出“统一剧本”：每层都有固定兜底和退出条件。

## 可复用 SOP：统一失败剧本（建议贴进团队 Runbook）
> 目标：救回任务 + 留下可复盘证据 + 不刷屏。

### 1) 先记录证据（必须）
- 记录：tool、error 原文、时间戳、sessionKey。
- 不确定信息标记 Unknown（例如：最终正文不可见就写 Unknown）。

### 2) 检索层（429 / fetch failed）
- 触发：出现 429 或连续 web_search=fetch failed。
- 动作：进入“退避 + 兜底”。（具体退避节奏在另一案例中被明确为 2s/5s/10s，若你当前实现不一致，标 Unknown 并补齐。）
- 兜底：切换到 DDG 文本结果（案例 A 的处理路径）。

### 3) 抓取层（private IP blocked）
- 触发：web_fetch 返回 Blocked: resolves to private/internal/special-use IP address。
- 动作：停止死磕 web_fetch，改为 browser 打开并读取页面内容，同时可并行 web_search 补来源。

### 4) 执行层（command not found）
- 触发：python/其他解释器不存在。
- 动作：先修工具链（python → python3），再继续后续处理；不要把失败“吞掉”。

### 5) 最终只发送一次结果
- 成功回执：至少包含 ok=true/false（案例均有 ok=true 证据）。
- 失败回执：明确失败层级与下一步动作。

## 课后作业
1) 把你最常跑的一条 cron/脚本，按四层（检索/抓取/执行/投递）写一张“失败分类表”，每类至少写：触发条件、兜底动作、退出条件。
2) 找一个你曾经遇到的失败，补齐证据字段（sessionKey/时间/错误原文/你当时做的动作）。缺的写 Unknown。
3) 给你的用例加一个“兜底开关”：当主链路失败 N 次后自动切换备胎（N=Unknown 也行，但要写清楚你准备怎么定）。
