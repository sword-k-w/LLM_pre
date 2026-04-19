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
    id: 'p2c', phase: 2, title: '2c — 格式控制', type: 'compare',
    newItem: '输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。',
    input: {
      context: null,
      question: '等了好久都没人回我！！你们 iPhone 的退货政策到底是什么？！这服务也太差了吧！',
    },
    left: {
      label: '无格式约束',
      output:
        '很抱歉给您带来不便。关于 ZephyrMart 的 iPhone 退货政策，\n' +
        '请查看以下信息：\n\n' +
        '1. **退货期限**：自购买之日起，通常有 30 天的退货期限。\n' +
        '2. **产品状态**：产品必须未开封且保持原始包装；如已开封，\n' +
        '   需确保产品无损且所有配件齐全。\n' +
        '3. **退货流程**：通过在线退货系统提交退货申请，或联系\n' +
        '   客户服务获取进一步指导。\n\n' +
        '如有任何问题，请联系人工客服。\n\n' +
        '（注：模型用训练数据里的通用退货条款填充了空白——幻觉）',
    },
    right: {
      label: '有格式约束',
      output:
        '我没有相关资料，请联系人工客服。\n' +
        '建议您通过 ZephyrMart 官网或客服热线与人工客服沟通，\n' +
        '以获取详细的退货政策信息。',
    },
    note:
      '格式约束的价值不只是"让输出更好看"——它给模型的输出空间划了上限。' +
      '无约束时模型为"显得有用"而展开填充，用训练数据里的通用退货条款产生幻觉。' +
      '2 句话的硬约束让模型没有空间编造。',
  },
  {
    id: 'p2d', phase: 2, title: '2d — One-shot 示例', type: 'compare',
    newItem:
      '示例输入：你们有哪些品牌的电视？\n' +
      '示例输出：我没有相关资料，请联系人工客服。您也可以访问 ZephyrMart 官网查看完整商品目录。',
    input: {
      context: null,
      question: 'ZephyrMart 的鞋子退货政策是什么？',
    },
    left: {
      label: '有格式约束，无示例',
      output:
        'ZephyrMart 的鞋子退货政策允许客户在购买后 30 天内退货，\n' +
        '鞋子必须未使用且包装完整。\n' +
        '建议您检查购买时的收据或联系人工客服以获取退货的详细步骤。\n\n' +
        '（注：格式对了，但内容是编的——3 次测试有 2 次幻觉）',
    },
    right: {
      label: '有格式约束，有示例',
      output:
        '我没有相关资料，请联系人工客服。\n' +
        '您也可以访问 ZephyrMart 官网查看详细退货政策。\n\n' +
        '（3 次测试全部正确拒答）',
    },
    note:
      '格式约束只规定了形状（2 句话），没规定遇到盲区时该填什么。' +
      'one-shot 示例直接锚定了"不知道 = 拒答"这个行为模式，' +
      '而不是让模型用训练数据去填充。',
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
      'Liu et al. (2023)《Lost in the Middle》发现：当把大量资料块\n' +
      '塞入长上下文时，模型对中间位置的内容注意力最弱（如右图 U 型曲线）\n' +
      '——头部和尾部最容易被引用，中间的关键信息容易被忽略。\n\n' +
      '现实 RAG 系统往往把几十段资料一起送进去；如果最相关的 chunk\n' +
      '恰好排在中间，模型可能给出错误答案，即使答案就在资料里。\n\n' +
      '解法：\n' +
      '\u2460 Reranking——把最相关的 chunk 排到最前面\n' +
      '\u2461 关键事实前置——在所有资料前加一行"关键事实：……"\n' +
      '下一步演示方案\u2461。',
    conceptImage: 'graph/lost_in_the_middle.png',
    conceptCaption: '论文原图：GPT-3.5 在 20 文档场景下，答案在中间时准确率最低',
    conceptRef: 'arXiv: 2307.03172',
    note:
      '诚实说明：我们用 gpt-4o-mini + 40 个长 chunk（~4000 tokens）测试过，模型三种位置全部答对——' +
      '现代模型经过了专项的长上下文训练，在这个规模上已基本消除了这个问题。' +
      '论文里的 U 型曲线在 GPT-3.5/早期 GPT-4 的 10K–100K token 场景下才显著。' +
      '生产系统里（几百个 chunk、几万 token）这个问题仍然值得警惕，但小 demo 里复现不出来。',
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
    id: 'p4-round1', phase: 4, title: '4a — 生成 + 测试', type: 'code-harness',
    leftLabel: '给模型的任务 Prompt（故意不提 × vs x）',
    leftCode:
      '请用 Python 实现函数：\n' +
      '\n' +
      '    def parse_receipt(text: str) -> list[dict]\n' +
      '\n' +
      '解析 ZephyrMart 收据文本，每行格式为：\n' +
      '    <商品名> × <数量> @ ¥<单价>\n' +
      '\n' +
      '返回列表，每个元素为：\n' +
      '    {"name": str, "qty": int,\n' +
      '     "unit_price": float, "subtotal": float}\n' +
      '\n' +
      '忽略空行。只输出函数代码。',
    leftLabel2: 'Harness 测试用例（接口约束先于代码存在）',
    leftCode2:
      'TEST_CASES = [\n' +
      '  {"input": "iPhone 14 Pro × 2 @ ¥8999.00",\n' +
      '   "expected": [{"name":"iPhone 14 Pro","qty":2,...}]},\n' +
      '\n' +
      '  # 关键边界：ASCII x（≠ ×）替代全角乘号\n' +
      '  {"input": "蓝牙音箱 x 1 @ ¥399.00",\n' +
      '   "expected": [{"name":"蓝牙音箱","qty":1,...}]},\n' +
      '\n' +
      '  {"input": "充电线  ×  3 @ ¥129.00", ...},\n' +
      '  {"input": "...\\n\\n...", ...},\n' +
      '  {"input": "\\n\\n\\n", "expected": []},\n' +
      ']',
    rightLabel: '[第 1 次] gpt-4o-mini 生成的代码 + Harness 测试结果',
    rightTerminal:
      'def parse_receipt(text: str) -> list[dict]:\n' +
      '    lines = text.strip().split(\'\\n\')\n' +
      '    results = []\n' +
      '    for line in lines:\n' +
      '        if line.strip():\n' +
      '            parts = line.split(\' × \')   # ← 只认全角 ×\n' +
      '            name = parts[0].strip()\n' +
      '            qty_price = parts[1].split(\' @ ¥\')\n' +
      '            qty = int(qty_price[0].strip())\n' +
      '            unit_price = float(qty_price[1].strip())\n' +
      '            subtotal = qty * unit_price\n' +
      '            results.append({...})\n' +
      '    return results\n' +
      '\n' +
      '══════════════════════════════════════\n' +
      '[Harness 测试结果]  4 / 5 通过\n' +
      '  ✗ FAIL: [ASCII x 替代 ×]\n' +
      '    输入：\'蓝牙音箱 x 1 @ ¥399.00\'\n' +
      '    异常：list index out of range\n' +
      '\n' +
      '→ 1 个测试失败，注入错误信息重试',
    note:
      '任务 prompt 没有提及 × vs x 这个边界条件——模型照例写了最直觉的实现。' +
      'Harness 立刻捕获到失败，并生成机器可读的错误信息，准备注入下一轮对话。',
  },
  {
    id: 'p4-fixed', phase: 4, title: '4b — 反馈注入 → 全部通过', type: 'code-harness',
    leftLabel: '自动注入的反馈（机器可读 → 直接续接对话）',
    leftCode:
      '# user message 追加到 messages[]\n' +
      'feedback = """\n' +
      '测试失败，请修复函数。失败详情：\n' +
      '\n' +
      '[ASCII x 替代 ×]\n' +
      '  输入：\'蓝牙音箱 x 1 @ ¥399.00\'\n' +
      '  抛出异常：list index out of range\n' +
      '"""\n' +
      'messages.append({"role":"assistant","content":resp1})\n' +
      'messages.append({"role":"user",     "content":feedback})',
    rightLabel: '[第 2 次] 修复后代码 + Harness 测试结果',
    rightTerminal:
      'def parse_receipt(text: str) -> list[dict]:\n' +
      '    lines = text.strip().split(\'\\n\')\n' +
      '    results = []\n' +
      '    for line in lines:\n' +
      '        if line.strip():\n' +
      '            line = line.replace(\' x \', \' × \')  # ← 新增\n' +
      '            parts = line.split(\' × \')\n' +
      '            if len(parts) == 2:\n' +
      '                name = parts[0].strip()\n' +
      '                qty_price = parts[1].split(\' @ ¥\')\n' +
      '                if len(qty_price) == 2:\n' +
      '                    qty = int(qty_price[0].strip())\n' +
      '                    unit_price = float(qty_price[1].strip())\n' +
      '                    subtotal = qty * unit_price\n' +
      '                    results.append({...})\n' +
      '    return results\n' +
      '\n' +
      '══════════════════════════════════════\n' +
      '[Harness 测试结果]  5 / 5 通过\n' +
      '  ✓ [基础：× 分隔符]\n' +
      '  ✓ [ASCII x 替代 ×]\n' +
      '  ✓ [多余空格]\n' +
      '  ✓ [多行 + 空行]\n' +
      '  ✓ [全为空行]\n' +
      '\n' +
      '══════════════════════════════════════\n' +
      '  第 1 次：4/5  →  第 2 次：5/5',
    note:
      '反馈自动注入、模型自动修复、Harness 自动验证——整个循环无需人工介入。' +
      '这就是 Harness 工程的核心：约束（test cases）+ 反馈循环（fail → fix → re-run）。',
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
  var diagramInner = step.conceptImage
    ? '<img class="concept-diagram-img" src="' + step.conceptImage + '" alt="' + esc(step.conceptTitle) + '">' +
      (step.conceptCaption ? '<p class="litm-caption">' + esc(step.conceptCaption) + '</p>' : '')
    : '<div class="litm-diagram">' +
      '<div class="litm-row litm-strong"><span class="litm-pos">1</span><span class="litm-bar">████████ 高注意力</span></div>' +
      '<div class="litm-row litm-strong"><span class="litm-pos">2</span><span class="litm-bar">███████</span></div>' +
      '<div class="litm-row litm-weak"><span class="litm-pos">3</span><span class="litm-bar">████ 注意力下降</span></div>' +
      '<div class="litm-row litm-weakest"><span class="litm-pos litm-key">★</span><span class="litm-bar litm-key-bar">███ 关键信息埋在中间</span></div>' +
      '<div class="litm-row litm-weak"><span class="litm-pos">5</span><span class="litm-bar">████</span></div>' +
      '<div class="litm-row litm-strong"><span class="litm-pos">6</span><span class="litm-bar">███████</span></div>' +
      '<div class="litm-row litm-strong"><span class="litm-pos">7</span><span class="litm-bar">████████ 高注意力</span></div>' +
      '</div><p class="litm-caption">U 型注意力分布示意：头尾强，中间弱</p>';
  return '<div class="concept-layout">' +
    '<div class="concept-block"><p class="eyebrow">核心概念</p>' +
    '<h2 class="concept-title">' + esc(step.conceptTitle) + '</h2>' +
    '<pre class="concept-body">' + esc(step.conceptBody) + '</pre>' +
    '<p class="concept-ref">参考文献：' + esc(step.conceptRef) + '</p></div>' +
    '<div class="concept-diagram">' + diagramInner + '</div></div>';
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

function renderCodeHarness(step) {
  var extraBlock = step.leftCode2
    ? '<div class="input-block input-block--secondary"><p class="input-block-label">' + esc(step.leftLabel2) + '</p>' +
      '<pre class="input-block-pre">' + esc(step.leftCode2) + '</pre></div>'
    : '';
  return '<div class="step-layout">' +
    '<div class="step-input-panel">' +
    '<div class="input-block"><p class="input-block-label">' + esc(step.leftLabel) + '</p>' +
    '<pre class="input-block-pre">' + esc(step.leftCode) + '</pre></div>' +
    extraBlock +
    '</div>' +
    '<div class="step-output-panel">' +
    '<div class="suite-terminal">' +
    '<p class="suite-label">' + esc(step.rightLabel) + '</p>' +
    '<pre class="suite-terminal-pre">' + esc(step.rightTerminal) + '</pre>' +
    '</div></div></div>';
}

function renderStep(index) {
  var step = STEPS[index];
  var html;
  if      (step.type === 'single')     html = renderSingle(step);
  else if (step.type === 'compare')    html = renderCompare(step);
  else if (step.type === 'concept')    html = renderConcept(step);
  else if (step.type === 'code-harness') html = renderCodeHarness(step);
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
