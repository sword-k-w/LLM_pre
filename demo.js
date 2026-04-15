const contexts = [
  {
    id: "syllabus-deliverable",
    title: "课程要求 - 小组授课交付物",
    text:
      "小组授课需提交一份 HTML 格式课件，并准备一个可现场运行的演示 demo。授课时间约 45 分钟，建议控制在 38 分钟内容讲解和 7 分钟机动讨论。",
  },
  {
    id: "syllabus-topic",
    title: "课程要求 - 主题范围",
    text:
      "讲解主题应围绕大语言模型中的工程实践问题，既包括提示设计，也包括上下文组织、实验评测或系统化落地方式。",
  },
  {
    id: "course-policy",
    title: "课堂规则 - 回答边界",
    text:
      "课程助手只能依据给定课程资料回答问题；如果资料没有覆盖，应明确说明不确定，并建议查看教师原始通知。",
  },
  {
    id: "project-style",
    title: "展示建议 - 课堂风格",
    text:
      "建议采用讲授与演示交替的节奏，先给概念框架，再立即用小型实验对比展示效果差异，让听众看到 prompt、context 和 harness 的分工。",
  },
];

const presets = {
  prompt: {
    label: "Prompt 段",
    questionIndex: 0,
    systemPrompt:
      "你是大语言模型课程的课程助教。请用中文回答，先给出简短结论，再用 2-3 个要点说明理由。如果资料不足，请明确说明不确定。",
    selectedMode: "prompt_optimized",
    checkedContexts: [],
    checks: [
      "回答是否先给结论，再给理由",
      "是否避免空泛废话",
      "是否在不知道时承认不确定",
    ],
    script:
      "先强调这里只改 prompt，不给课程资料。让同学观察：回答结构更整齐了，但事实依据仍然不稳。",
  },
  context: {
    label: "Context 段",
    questionIndex: 1,
    systemPrompt:
      "你是大语言模型课程的课程助教。只依据提供的课程资料回答。请输出：1) 结论 2) 依据 3) 如果资料不足则说明缺口。",
    selectedMode: "context_augmented",
    checkedContexts: ["syllabus-deliverable", "course-policy"],
    checks: [
      "回答是否引用到了课程资料中的具体事实",
      "是否体现出资料缺口与回答边界",
      "是否比单纯 prompt 优化更具体",
    ],
    script:
      "这里的重点是：同样的表达能力，如果把正确资料送进模型，答案会从“像那么回事”变成“有依据”。",
  },
  harness: {
    label: "Harness 段",
    questionIndex: 2,
    systemPrompt:
      "你是大语言模型课程的课程助教。必须使用三段式输出：结论、证据、风险。证据部分只引用给定课程资料；如果资料不全，风险部分指出未知项。",
    selectedMode: "harness_mode",
    checkedContexts: [
      "syllabus-deliverable",
      "syllabus-topic",
      "course-policy",
      "project-style",
    ],
    checks: [
      "输出是否稳定遵守固定模板",
      "是否给出证据来源与未知项",
      "是否适合作为后续回归测试样例",
    ],
    script:
      "这里不再只看某一次回答好不好，而是看这套设置能不能被固定下来，之后继续拿来做比较和回归。",
  },
};

const standardQuestions = [
  "课程项目需要交什么内容？",
  "小组授课最终需要提交哪些文件？",
  "为什么建议把 demo 穿插在讲授过程中？",
];

const fallbackLibrary = {
  baseline: [
    "课程项目一般需要提交课件、报告和演示材料，不过具体要看老师要求。建议准备完整一些的展示内容。",
    "通常会提交课件和一些辅助文件，但不同课程安排不太一样，最好确认老师通知。",
    "穿插 demo 有助于提高课堂参与度，让同学更容易理解，但这更多是一种展示风格上的建议。",
  ],
  prompt_optimized: [
    "结论：课程项目通常需要一份展示材料和相应说明。\n\n要点：\n1. 需要围绕课程主题组织清晰的讲授内容。\n2. 最好准备可演示的材料以增强说服力。\n3. 如果具体提交格式没有给出，我不能确定是否还需要其他文件。",
    "结论：通常需要提交与小组授课相关的展示文件。\n\n要点：\n1. 至少应有一份用于授课的课件。\n2. 可能还需要 demo 或补充材料，但当前没有证据确认。\n3. 如果老师另有通知，应以原通知为准。",
    "结论：把 demo 穿插在讲授中，能让抽象概念更快落地。\n\n要点：\n1. 听众刚听完方法，马上就能看到效果差异。\n2. 课堂节奏更紧凑，不必等到最后集中展示。\n3. 具体是否推荐这种形式，还需要课程资料支持。",
  ],
  context_augmented: [
    "结论：课程项目需要提交 HTML 格式课件和一个可现场运行的 demo。\n\n依据：\n1. 课程要求写明，小组授课需提交一份 HTML 格式课件。\n2. 同一条要求说明，还需要准备一个可现场运行的演示 demo。\n3. 授课时长约 45 分钟，建议按 38 分钟内容讲解和 7 分钟机动讨论来组织。",
    "结论：小组授课最终需要提交至少两类文件：HTML 课件和 demo。\n\n依据：\n1. 课程要求 - 小组授课交付物明确提到 HTML 格式课件。\n2. 同一资料还要求准备可现场运行的演示 demo。\n3. 课程助手如果资料未覆盖其他附加材料，应明确说明未知，而不是自行补充。",
    "结论：因为课程建议采用“讲授与演示交替”的节奏，所以把 demo 穿插在讲授中更符合要求。\n\n依据：\n1. 展示建议指出，先讲概念框架，再立即用小型实验对比展示效果差异。\n2. 这种节奏能让听众直接看到 prompt、context 和 harness 的分工。\n3. 如果没有更多教学安排说明，就不应再扩展额外原因。",
  ],
  harness_mode: [
    "结论：当前能确认的交付物是 HTML 课件与现场 demo。\n\n证据：\n- 课程要求 - 小组授课交付物：需提交 HTML 格式课件。\n- 同一资料：需准备一个可现场运行的演示 demo。\n- 同一资料：授课时间约 45 分钟，建议控制为 38 分钟内容加 7 分钟机动。\n\n风险：\n- 资料没有说明是否必须提交书面报告，因此不能擅自补充。",
    "结论：最终提交文件至少包括 HTML 课件和 demo。\n\n证据：\n- 课程要求中明确写出这两项交付物。\n- 课堂规则要求助手只依据给定课程资料回答。\n\n风险：\n- 若老师另行通知还要 README、录像或源码打包，当前资料没有覆盖，需要再查原始通知。",
    "结论：把 demo 穿插在讲授过程中，是为了形成可观察、可比较的小实验节奏。\n\n证据：\n- 展示建议提出先给概念框架，再立即用小型实验对比展示效果差异。\n- Harness 的目的之一是让不同设置在同样问题下可比较、可复现。\n\n风险：\n- 如果现场网络不稳定，实时 API 演示可能失败，因此需要 fallback 方案。",
  ],
};

const ui = {
  presetButtons: Array.from(document.querySelectorAll(".preset-button")),
  modeButtons: Array.from(document.querySelectorAll(".mode-button")),
  userQuery: document.getElementById("user-query"),
  systemPrompt: document.getElementById("system-prompt"),
  contextList: document.getElementById("context-list"),
  runComparison: document.getElementById("run-comparison"),
  toggleContexts: document.getElementById("toggle-contexts"),
  cycleQuestion: document.getElementById("cycle-question"),
  presetLabel: document.getElementById("preset-label"),
  questionIndex: document.getElementById("question-index"),
  selectedModeLabel: document.getElementById("selected-mode-label"),
  selectedTitle: document.getElementById("selected-title"),
  selectedModeTag: document.getElementById("selected-mode-tag"),
  baselineLatency: document.getElementById("baseline-latency"),
  selectedLatency: document.getElementById("selected-latency"),
  baselineSource: document.getElementById("baseline-source"),
  selectedSource: document.getElementById("selected-source"),
  baselineOutput: document.getElementById("baseline-output"),
  selectedOutput: document.getElementById("selected-output"),
  harnessChecks: document.getElementById("harness-checks"),
  scriptNote: document.getElementById("script-note"),
};

const state = {
  presetKey: "prompt",
  selectedMode: "prompt_optimized",
  questionCursor: 0,
};

function renderContexts(checkedContextIds) {
  ui.contextList.innerHTML = "";

  contexts.forEach((context) => {
    const wrapper = document.createElement("article");
    wrapper.className = "context-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = context.id;
    checkbox.checked = checkedContextIds.includes(context.id);

    const label = document.createElement("label");
    const title = document.createElement("strong");
    title.textContent = context.title;
    const body = document.createElement("p");
    body.textContent = context.text;

    label.appendChild(checkbox);
    label.append(" ");
    label.appendChild(title);
    label.appendChild(body);
    wrapper.appendChild(label);
    ui.contextList.appendChild(wrapper);
  });
}

function getSelectedContextIds() {
  return Array.from(ui.contextList.querySelectorAll('input[type="checkbox"]:checked')).map(
    (checkbox) => checkbox.value
  );
}

function getSelectedContexts() {
  const selectedIds = new Set(getSelectedContextIds());
  return contexts.filter((context) => selectedIds.has(context.id));
}

function renderChecks(checks) {
  ui.harnessChecks.innerHTML = "";

  checks.forEach((check) => {
    const item = document.createElement("li");
    item.textContent = check;
    ui.harnessChecks.appendChild(item);
  });
}

function updateModeButtons() {
  ui.modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.selectedMode);
  });
}

function updatePresetButtons() {
  ui.presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === state.presetKey);
  });
}

function applyPreset(presetKey) {
  const preset = presets[presetKey];
  state.presetKey = presetKey;
  state.selectedMode = preset.selectedMode;
  state.questionCursor = preset.questionIndex;

  ui.userQuery.value = standardQuestions[state.questionCursor];
  ui.systemPrompt.value = preset.systemPrompt;
  ui.presetLabel.textContent = preset.label;
  ui.questionIndex.textContent = `${state.questionCursor + 1} / ${standardQuestions.length}`;
  ui.selectedModeLabel.textContent = formatModeName(state.selectedMode);
  ui.selectedTitle.textContent = formatModeName(state.selectedMode);
  ui.selectedModeTag.textContent = `Mode: ${state.selectedMode}`;
  ui.scriptNote.textContent = preset.script;

  renderContexts(preset.checkedContexts);
  renderChecks(preset.checks);
  updatePresetButtons();
  updateModeButtons();
  clearOutputs();
}

function formatModeName(mode) {
  const mapping = {
    prompt_optimized: "Prompt Optimized",
    context_augmented: "Context Augmented",
    harness_mode: "Harness Mode",
  };

  return mapping[mode] || mode;
}

function clearOutputs() {
  ui.baselineLatency.textContent = "-- ms";
  ui.selectedLatency.textContent = "-- ms";
  ui.baselineSource.textContent = "等待运行";
  ui.selectedSource.textContent = "等待运行";
  ui.baselineOutput.textContent = "";
  ui.selectedOutput.textContent = "";
}

function buildRequestPayload(mode) {
  const selectedContexts =
    mode === "baseline" ? [] : getSelectedContexts().map((context) => context.text);

  return {
    system_prompt: mode === "baseline" ? "请直接回答用户问题。" : ui.systemPrompt.value,
    user_query: ui.userQuery.value.trim(),
    context_blocks: selectedContexts,
    experiment_mode: mode,
  };
}

async function callModel(mode) {
  const startedAt = performance.now();
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildRequestPayload(mode)),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  const latency = data.latency_ms || Math.round(performance.now() - startedAt);

  return {
    answer: data.answer,
    latency_ms: latency,
    fallback_used: Boolean(data.fallback_used),
    source: data.fallback_used ? "server fallback" : "live api",
    mode_used: data.mode_used || mode,
  };
}

function buildLocalFallback(mode) {
  const answer =
    fallbackLibrary[mode][state.questionCursor] ||
    "当前没有命中预置样例，请更换标准问题。";

  return {
    answer,
    latency_ms: Math.round(120 + Math.random() * 120),
    fallback_used: true,
    source: "local fallback",
    mode_used: mode,
  };
}

async function getResponse(mode) {
  try {
    return await callModel(mode);
  } catch (error) {
    return buildLocalFallback(mode);
  }
}

function renderResult(target, result) {
  if (target === "baseline") {
    ui.baselineLatency.textContent = `${result.latency_ms} ms`;
    ui.baselineSource.textContent = result.source;
    ui.baselineOutput.textContent = result.answer;
    return;
  }

  ui.selectedLatency.textContent = `${result.latency_ms} ms`;
  ui.selectedSource.textContent = result.source;
  ui.selectedOutput.textContent = result.answer;
}

async function runComparison() {
  ui.runComparison.disabled = true;
  ui.runComparison.textContent = "运行中...";
  clearOutputs();

  const [baselineResult, selectedResult] = await Promise.all([
    getResponse("baseline"),
    getResponse(state.selectedMode),
  ]);

  renderResult("baseline", baselineResult);
  renderResult("selected", selectedResult);

  ui.runComparison.disabled = false;
  ui.runComparison.textContent = "运行对比";
}

ui.presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.preset);
  });
});

ui.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedMode = button.dataset.mode;
    ui.selectedModeLabel.textContent = formatModeName(state.selectedMode);
    ui.selectedTitle.textContent = formatModeName(state.selectedMode);
    ui.selectedModeTag.textContent = `Mode: ${state.selectedMode}`;
    updateModeButtons();
    clearOutputs();
  });
});

ui.toggleContexts.addEventListener("click", () => {
  const checkboxes = Array.from(ui.contextList.querySelectorAll('input[type="checkbox"]'));
  const allChecked = checkboxes.every((checkbox) => checkbox.checked);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allChecked;
  });
});

ui.cycleQuestion.addEventListener("click", () => {
  state.questionCursor = (state.questionCursor + 1) % standardQuestions.length;
  ui.userQuery.value = standardQuestions[state.questionCursor];
  ui.questionIndex.textContent = `${state.questionCursor + 1} / ${standardQuestions.length}`;
  clearOutputs();
});

ui.runComparison.addEventListener("click", runComparison);

applyPreset("prompt");
