# LLM_pre

这是“大语言模型课程”小组授课的课件与 demo 项目，主题是：

- Prompt Engineering
- Context Engineering
- Harness Engineering

## 项目结构

- `index.html`
  主课件，按课堂演示页方式组织。
- `demo.html`
  互动 demo 页面，用来现场对比 prompt / context / harness 三种工程思路。
- `styles.css`
  课件和 demo 共用的样式文件。
- `deck.js`
  课件翻页和进度条逻辑。
- `demo.js`
  demo 的预设、对比模式、fallback 逻辑。
- `server.py`
  本地启动服务，同时提供静态页面和 `/api/chat` 接口代理。

## 怎么用

1. 启动本地服务：

```bash
python3 server.py
```

2. 打开浏览器访问：

- `http://127.0.0.1:8000/`：课件页
- `http://127.0.0.1:8000/demo.html`：demo 页

3. 课件页使用方式：

- 键盘 `← / →` 可以翻页
- 也可以直接点击页面翻到下一页

4. demo 页使用方式：

- 左侧选择 `Prompt 段 / Context 段 / Harness 段`
- 可以切换问题、修改 system prompt、勾选上下文资料
- 点击“运行对比”后，会同时显示 baseline 和当前模式的输出
- 如果没有配置大模型 API，会自动使用内置 fallback 结果，不会影响课堂演示

## 可选环境变量

如果你希望 demo 走实时大模型接口，可以配置：

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`
