// ---------------------------------------------------------------------------
// Step data  (all strings use single quotes to avoid conflict with " Chinese quotes)
// ---------------------------------------------------------------------------
const STEPS = [
  {
    id: 'p1', phase: 1, title: '无工程介入', type: 'single',
    input: { systemPrompt: null, context: null, question: '我买的 iPhone 退货政策是什么？' },
    output:
      'iPhone 的退货政策可能因购买地点和销售渠道而有所不同。\n\n' +
      '1. 苹果官网或苹果零售店：苹果通常提供 14 天退货期，自收到产品之日起计算。' +
      '产品必须处于完好状态，并包括所有原始包装和配件。\n\n' +
      '2. 授权经销商：退货期可能是 7 到 14 天。' +
      '具体政策请查看经销商的退货条款，或直接咨询销售人员。\n\n' +
      '3. 在线购物平台（如京东、天猫等）：通常提供 7 到 15 天的退货期。\n\n' +
      '无论在哪购买，建议在购买前仔细阅读相关退货政策，并在需要退货时尽快采取行动。',
    note:
      '没有 system prompt，模型直接从训练数据回答——给出的是 Apple 官方三渠道政策，不是 ZephyrMart 的实际规定。' +
      '问题不在"提示词写得不好"，而在于模型根本不知道 ZephyrMart 的规定。',
  },
  {
    id: 'p2a', phase: 2, title: '2a — 任务说明', type: 'single',
    newItem: '无法确认的信息，回复"我没有相关资料，请联系人工客服"，不要猜测或编造。',
    input: {
      systemPrompt:
        '你是 ZephyrMart 的客服助理，只回答与 ZephyrMart 相关的产品和政策问题。\n' +
        '无法确认的信息，回复"我没有相关资料，请联系人工客服"，不要猜测或编造。',
      context: null, question: '我买的 iPhone 退货政策是什么？',
    },
    output: '我没有相关资料，请联系人工客服。',
    note:
      '加入角色 + 边界 + 拒答规则：模型从"胡编 Apple 政策"变成了"正确拒答"。' +
      '诚实但无用——因为 ZephyrMart 的政策数据还没给它。',
  },
  {
    id: 'p2b', phase: 2, title: '2b — CoT 推理引导', type: 'compare',
    newItem: '回答步骤：先逐条列出每个优惠条件是否满足，再计算最终金额，最后给出结论。',
    input: {
      context:
        '[ZephyrMart 促销规则]\n- 满 300 减 30\n- 满 500 减 80\n' +
        '- 电子产品额外 9 折（折扣在满减之后计算）\n' +
        '- 同一订单只能叠加一档满减，取门槛最高且满足条件的那档',
      question: '我买了一台 ¥399 的蓝牙音箱和一根 ¥129 的充电线，请问能享受哪些优惠，最终需要付多少钱？',
    },
    left: {
      label: '不带 CoT',
      output:
        '根据 ZephyrMart 的促销规则，订单总金额 ¥399 + ¥129 = ¥528。\n' +
        '满 500 减 80，享受 ¥80 满减优惠。\n\n' +
        '对蓝牙音箱（电子产品）应用 9 折：\n' +
        '  ¥399 - (399/528 × 80) = ¥398.39，×0.9 = ¥358.55\n' +
        '充电线：¥129 - (129/528 × 80) = ¥128.52\n\n' +
        '最终支付：¥358.55 + ¥128.52 = ¥487.07  ✗（正确答案是 ¥403.2）',
    },
    right: {
      label: '加 CoT 指令',
      output:
        '1. 商品总金额：¥399（蓝牙音箱）+ ¥129（充电线）= ¥528\n\n' +
        '2. 满减优惠：\n' +
        '   - 满 300 减 30：满足\n' +
        '   - 满 500 减 80：满足\n' +
        '   → 取门槛最高且满足条件的一档：满 500 减 80\n\n' +
        '3. 电子产品额外 9 折（在满减之后）：\n' +
        '   ¥528 - ¥80 = ¥448\n' +
        '   ¥448 × 0.9 = ¥403.2\n\n' +
        '最终需要支付的金额为 ¥403.2  ✓',
    },
    note:
      '同一道题 8 次测试：不带 CoT 仅 1/8 算出正确答案；加入 CoT 步骤指令后 8/8 全部正确。' +
      'CoT 把隐式推理步骤显式化，让模型不会跳步出错。',
  },
  {
    id: 'p2c', phase: 2, title: '2c — 格式控制', type: 'single',
    newItem: '输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。',
    input: {
      systemPrompt:
        '你是 ZephyrMart 的客服助理，只回答与 ZephyrMart 相关的产品和政策问题。\n' +
        '无法确认的信息，回复"我没有相关资料，请联系人工客服"，不要猜测或编造。\n' +
        '回答步骤：先逐条列出每个优惠条件是否满足，再计算最终金额，最后给出结论。\n' +
        '输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。',
      context: null, question: '我买的 iPhone 退货政策是什么？',
    },
    output: '我没有相关资料，请联系人工客服。',
    note: '格式约束把每次输出锁定为"结论句 + 下一步句"——输出长度和结构可预期，方便后续 Harness 测试对输出做断言。',
  },
  {
    id: 'p2d', phase: 2, title: '2d — One-shot 示例', type: 'single',
    newItem:
      '示例输入：你们有哪些品牌的电视？\n' +
      '示例输出：我没有相关资料，请联系人工客服。您也可以访问 ZephyrMart 官网查看完整商品目录。',
    input: {
      systemPrompt:
        '你是 ZephyrMart 的客服助理，只回答与 ZephyrMart 相关的产品和政策问题。\n' +
        '无法确认的信息，回复"我没有相关资料，请联系人工客服"，不要猜测或编造。\n' +
        '输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。\n\n' +
        '示例输入：你们有哪些品牌的电视？\n' +
        '示例输出：我没有相关资料，请联系人工客服。您也可以访问 ZephyrMart 官网查看完整商品目录。',
      context: null, question: '我买的 iPhone 退货政策是什么？',
    },
    output: '我没有相关资料，请联系人工客服。您也可以访问 ZephyrMart 官网查看详细退货政策。',
    note:
      'One-shot 示例示范了"建议下一步"的语气粒度：把用户引导到官网，而不是空泛的"请联系客服"。' +
      '模型从示例学到了 tone，不需要在 prompt 里逐字描述语气。',
  },
  {
    id: 'p3a', phase: 3, title: '3a — RAG 注入', type: 'single',
    input: {
      systemPrompt:
        '你是 ZephyrMart 的客服助理，只依据提供的资料回答，不要猜测或编造。\n' +
        '无法确认的信息，回复"我没有相关资料，请联系人工客服"。\n' +
        '输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。',
      context: '[资料 1]\n所有智能手机提供 14 天退货窗口，需保留原始收据和完整包装。',
      question: '我买的 iPhone 退货政策是什么？',
    },
    output:
      '根据资料，您的 iPhone 可以在购买后的 14 天内退货。' +
      '请确保保留原始收据和完整包装。如果有进一步的疑问，请联系人工客服。',
    note:
      '从知识库检索到相关 chunk，注入 [资料] 后模型给出了正确的"14 天"答案。' +
      '提示词没变，只是多了一段资料——这就是上下文工程的核心：给模型"教材"，而不是让它靠记忆猜测。',
  },
  {
    id: 'p3b', phase: 3, title: '3b — Lost in the Middle', type: 'concept',
    conceptTitle: '为什么信息的位置很重要？',
    conceptBody:
      'Liu et al. (2023)《Lost in the Middle》发现：当把大量资料块塞入长上下文时，\n' +
      '模型对处于上下文中间位置的内容注意力最弱——头部和尾部最容易被引用，中间的关键信息容易被忽略。\n\n' +
      '现实 RAG 系统往往把几十段资料一起送进去；如果最相关的 chunk 恰好排在中间，\n' +
      '模型可能给出不完整甚至错误的答案，即使答案就在资料里。\n\n' +
      '解法：\n' +
      '\u2460 Reranking——把最相关的 chunk 排到最前面\n' +
      '\u2461 关键事实前置——在所有资料前加一行"关键事实：……"\n' +
      '下一步演示方案\u2461。',
    conceptRef: 'arXiv: 2307.03172',
    note:
      '这个效应在现实中对应几十个 200-500 token chunk 全部注入的场景。' +
      '实验室级别的短 chunk 演示效果不明显，但在生产系统中是常见故障模式。',
  },
  {
    id: 'p3c', phase: 3, title: '3c — 关键事实前置', type: 'single',
    input: {
      systemPrompt:
        '你是 ZephyrMart 的客服助理，只依据提供的资料回答，不要猜测或编造。\n' +
        '无法确认的信息，回复"我没有相关资料，请联系人工客服"。\n' +
        '输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。',
      context:
        '关键事实：所有智能手机提供 14 天退货窗口，需保留原始收据和完整包装。\n\n' +
        '[资料 1]\n所有智能手机提供 14 天退货窗口，需保留原始收据和完整包装。\n\n' +
        '[资料 2]\nZephyrMart 门店营业时间为每天 10:00\u201322:00。\n\n' +
        '[资料 3]\n会员积分可在下次购物时抵扣，有效期 180 天。',
      question: '我买的 iPhone 退货政策是什么？',
    },
    output:
      '您的 iPhone 符合智能手机的退货政策，可以在购买后的 14 天内退货，但需要保留原始收据和完整包装。' +
      '建议您确保满足这些条件，然后前往 ZephyrMart 门店办理退货手续。',
    note:
      '在多段资料前加一行"关键事实"，把最相关信息拉到最前面——这是最轻量的 reranking 方式。' +
      '模型正确引用了 14 天政策。信息的位置决定模型是否真正"看见"它。',
  },
  {
    id: 'p4-buggy', phase: 4, title: '4a — Buggy Prompt', type: 'test-suite',
    suiteLabel: 'Buggy prompt（缺少严格上下文约束）',
    results: [
      {
        status: 'pass', name: '退货政策（有资料）', ms: 2221,
        answer:
          'iPhone 的退货政策是自购买日起有 14 天的退货窗口，需保留原始收据和完整包装。' +
          '请确保您在退货窗口内，并携带必要的文件和包装到店办理退货。',
      },
      {
        status: 'fail', name: '超出知识库范围（鞋类）', ms: 1927,
        answer:
          'ZephyrMart 的鞋子退货政策允许在购买后 30 天内退货，前提是鞋子未被穿过且保留原始包装。' +
          '建议您访问 ZephyrMart 官方网站或联系客户服务以获取详细退货步骤和条件。',
        reason: '缺少关键词「没有相关资料」— 模型用训练数据编造了 30 天政策',
      },
      {
        status: 'fail', name: '完全离题请求', ms: 870,
        answer:
          '抱歉，我不能提供关于天气的信息。您可以使用天气应用程序或网站获取上海的最新天气信息。',
        reason: '缺少关键词「没有相关资料」— 没有给出规范拒答短语',
      },
    ],
    summary: '结果：1/3 通过  平均延迟：1673ms',
    note:
      '测试套件自动定位到：模型缺少严格上下文约束，用训练数据编造了鞋类退货政策，' +
      '对离题问题也没有给出规范拒答短语。修复：在 system prompt 补回一行严格上下文约束规则。',
  },
  {
    id: 'p4-fixed', phase: 4, title: '4b — Fixed Prompt', type: 'test-suite',
    suiteLabel: 'Fixed prompt（补回严格上下文约束）',
    results: [
      {
        status: 'pass', name: '退货政策（有资料）', ms: 2180,
        answer:
          'iPhone 的退货政策是提供 14 天的退货窗口。请确保保留原始收据和完整包装。' +
          '建议您在退货窗口内联系 ZephyrMart 进行退货处理。',
      },
      {
        status: 'pass', name: '超出知识库范围（鞋类）', ms: 2189,
        answer:
          '我没有相关资料，请联系人工客服。建议您直接访问我们的网站或联系 ZephyrMart 的人工客服' +
          '以获取鞋子退货政策的详细信息。',
      },
      {
        status: 'pass', name: '完全离题请求', ms: 1936,
        answer: '我没有相关资料，请联系人工客服。建议您通过天气预报平台查询上海的天气信息。',
      },
    ],
    summary: '结果：3/3 通过  平均延迟：2102ms',
    final: 'Buggy: 1/3  \u2192  Fixed: 3/3',
    note:
      '补回"只能依据 [参考资料] 作答"规则后，三项全部通过。' +
      '测试套件自动定位到错误、验证修复——这就是 Harness 工程的核心：' +
      '约束（test cases）+ 反馈循环（fail \u2192 fix \u2192 re-run）。',
  },
];

const PHASES = { 1: '基准失败', 2: '提示工程', 3: '上下文工程', 4: 'Harness' };
let cursor = 0;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function blockHTML(label, text, cls) {
  if (!text) return '';
  return '<div class="input-block ' + (cls||'') + '">' +
    '<p class="input-block-label">' + label + '</p>' +
    '<pre class="input-block-pre">' + esc(text) + '</pre></div>';
}

function newItemHTML(text) {
  if (!text) return '';
  return '<div class="new-item-callout"><span class="new-item-badge">新增</span>' +
    '<pre class="new-item-pre">' + esc(text) + '</pre></div>';
}

function renderSingle(step) {
  var i = step.input;
  return '<div class="step-layout">' +
    '<div class="step-input-panel">' +
    blockHTML('System Prompt', i.systemPrompt, 'block-system') +
    blockHTML('上下文 / Context', i.context, 'block-context') +
    blockHTML('用户提问', i.question, 'block-question') +
    newItemHTML(step.newItem) + '</div>' +
    '<div class="step-output-panel">' +
    '<p class="input-block-label">模型输出</p>' +
    '<pre class="output-pre">' + esc(step.output) + '</pre></div></div>';
}

function renderCompare(step) {
  var i = step.input;
  return '<div class="step-layout">' +
    '<div class="step-input-panel">' +
    blockHTML('上下文 / Context', i.context, 'block-context') +
    blockHTML('用户提问', i.question, 'block-question') +
    newItemHTML(step.newItem) + '</div>' +
    '<div class="step-output-panel"><div class="compare-grid">' +
    '<div class="compare-col compare-col--bad"><p class="compare-label">' + esc(step.left.label) + '</p>' +
    '<pre class="output-pre">' + esc(step.left.output) + '</pre></div>' +
    '<div class="compare-col compare-col--good"><p class="compare-label">' + esc(step.right.label) + '</p>' +
    '<pre class="output-pre">' + esc(step.right.output) + '</pre></div>' +
    '</div></div></div>';
}

function renderConcept(step) {
  return '<div class="concept-layout">' +
    '<div class="concept-block"><p class="eyebrow">核心概念</p>' +
    '<h2 class="concept-title">' + esc(step.conceptTitle) + '</h2>' +
    '<pre class="concept-body">' + esc(step.conceptBody) + '</pre>' +
    '<p class="concept-ref">参考文献：' + esc(step.conceptRef) + '</p></div>' +
    '<div class="concept-diagram">' +
    '<div class="litm-diagram">' +
    '<div class="litm-row litm-strong"><span class="litm-pos">1</span><span class="litm-bar">████████ 高注意力</span></div>' +
    '<div class="litm-row litm-strong"><span class="litm-pos">2</span><span class="litm-bar">███████</span></div>' +
    '<div class="litm-row litm-weak"><span class="litm-pos">3</span><span class="litm-bar">████ 注意力下降</span></div>' +
    '<div class="litm-row litm-weakest"><span class="litm-pos litm-key">★</span><span class="litm-bar litm-key-bar">███ 关键信息埋在中间</span></div>' +
    '<div class="litm-row litm-weak"><span class="litm-pos">5</span><span class="litm-bar">████</span></div>' +
    '<div class="litm-row litm-strong"><span class="litm-pos">6</span><span class="litm-bar">███████</span></div>' +
    '<div class="litm-row litm-strong"><span class="litm-pos">7</span><span class="litm-bar">████████ 高注意力</span></div>' +
    '</div><p class="litm-caption">U 型注意力分布示意：头尾强，中间弱</p>' +
    '</div></div>';
}

function renderTestRow(r) {
  var icon = r.status === 'pass' ? '✓ PASS' : '✗ FAIL';
  var cls  = r.status === 'pass' ? 'test-row--pass' : 'test-row--fail';
  return '<div class="test-row ' + cls + '">' +
    '<div class="test-row-head">' +
    '<span class="test-status-badge">' + icon + '</span>' +
    '<span class="test-name">' + esc(r.name) + '</span>' +
    '<span class="test-ms">' + r.ms + 'ms</span></div>' +
    '<p class="test-answer">回答：' + esc(r.answer) + '</p>' +
    (r.reason ? '<p class="test-reason">原因：' + esc(r.reason) + '</p>' : '') +
    '</div>';
}

function renderTestSuite(step) {
  return '<div class="suite-layout"><div class="suite-terminal">' +
    '<p class="suite-label">' + esc(step.suiteLabel) + '</p>' +
    '<div class="suite-rows">' + step.results.map(renderTestRow).join('') + '</div>' +
    '<p class="suite-summary">' + esc(step.summary) + '</p>' +
    (step.final ? '<p class="suite-final">' + esc(step.final) + '</p>' : '') +
    '</div></div>';
}

function renderStep(index) {
  var step = STEPS[index];
  var html;
  if      (step.type === 'single')     html = renderSingle(step);
  else if (step.type === 'compare')    html = renderCompare(step);
  else if (step.type === 'concept')    html = renderConcept(step);
  else if (step.type === 'test-suite') html = renderTestSuite(step);
  else html = '<p>Unknown type</p>';

  document.getElementById('step-content').innerHTML = html;
  document.getElementById('step-counter').textContent = (index + 1) + ' / ' + STEPS.length;
  document.getElementById('step-title-tag').textContent = step.title;
  document.getElementById('teacher-note').textContent = step.note || '';

  document.querySelectorAll('.phase-badge').forEach(function(el) {
    el.classList.toggle('is-active', Number(el.dataset.phase) === step.phase);
  });
  document.getElementById('prev-btn').disabled = index === 0;
  document.getElementById('next-btn').disabled = index === STEPS.length - 1;
}

function go(delta) {
  var next = cursor + delta;
  if (next < 0 || next >= STEPS.length) return;
  cursor = next;
  renderStep(cursor);
}

document.getElementById('prev-btn').addEventListener('click', function() { go(-1); });
document.getElementById('next-btn').addEventListener('click', function() { go(1); });
document.addEventListener('keydown', function(e) {
  if      (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
  else if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(-1);
  else if (e.key === 'Home') { cursor = 0; renderStep(0); }
});

function buildPhaseNav() {
  var nav = document.getElementById('phase-nav');
  nav.innerHTML = Object.entries(PHASES).map(function(e) {
    return '<button class="phase-badge" data-phase="' + e[0] + '">' + e[1] + '</button>';
  }).join('');
  nav.addEventListener('click', function(e) {
    var b = e.target.closest('.phase-badge');
    if (!b) return;
    var idx = STEPS.findIndex(function(s) { return s.phase === Number(b.dataset.phase); });
    if (idx !== -1) { cursor = idx; renderStep(cursor); }
  });
}

buildPhaseNav();
renderStep(0);
