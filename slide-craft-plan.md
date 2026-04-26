# Presentation Plan: slide-craft Skill 介绍
Theme: tech
Pages: 4
Audience: 开发者 / Claude Code 用户

---

## Slide 1: slide-craft — HTML 幻灯片生成器
layout: slide-grid-cover
key_message: slide-craft 是一个 Claude Code skill，能将任何主题一键生成精美的自包含 HTML 演示文稿。
content:
- 零依赖: 单文件 HTML，内联 CSS + JS，无需安装任何工具
- 4 种主题: warm · tech · minimal · forest 开箱即用
- 多语言支持: 中英文均可，CJK 字体栈内置
speaker_notes: 介绍 slide-craft 的定位——它是一个 Claude Code skill，用户只需描述主题，AI 就能生成完整的演示文稿 HTML 文件。

---

## Slide 2: 六步工作流
layout: timeline-grid
key_message: slide-craft 将生成过程拆分为 6 个有序阶段，确保输出质量可控。
content:
- ① Gather: 从用户消息中提取主题、页数、主题风格等参数
- ② Draft Plan: 生成结构化计划文件（.md），每页含布局、关键信息与演讲注释
- ③ Confirm: 暂停等待用户确认计划，支持修改后重新确认
- ④ Theme: 读取 design_tokens.md，选定 CSS 变量集合
speaker_notes: 重点强调 Phase 3 的"先确认再生成"机制，避免大模型直接输出用户不满意的内容。

---

## Slide 3: 7 种布局 × 4 套主题
layout: two-column
key_message: 丰富的布局库与主题系统让每张幻灯片都具备专业设计感。
content:
- 布局库: slide-grid-cover（封面）· card-stack（并列要点）· timeline-grid（流程）· relationship-grid（矩阵）· two-column（对比）· slide-cover-center（章节过渡）
- 主题系统: warm（人文暖色）· tech（深色科技）· minimal（商务简洁）· forest（自然森林）
speaker_notes: 演示不同布局和主题的视觉效果对比。

---

## Slide 4: 立即开始使用
layout: slide-cover-center
key_message: 安装 slide-craft plugin 后，使用 /slide-craft 命令即可启动。
content:
- 安装方式: 将 SKILL.md 及 assets/ references/ 目录放入 ~/.claude/plugins/slide-craft/skills/slide-craft/
- 调用方式: 在 Claude Code 中输入 /slide-craft [主题] [--pages N] [--theme warm|tech|minimal|forest]
- 输出产物: 当前目录下的 <topic-slug>-slides.html，浏览器直接打开即可演示
speaker_notes: 结尾鼓励用户动手尝试，强调零依赖的便捷性。
