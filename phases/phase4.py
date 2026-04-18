"""
Phase 4: Harness Engineering — constraints + feedback loop.

Demo flow:
  1. Show a "buggy" system prompt (missing refusal rule)
  2. Run test suite → some cases fail
  3. Fix: add refusal rule back
  4. Re-run → all pass
  5. Print final metrics
"""

import os
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(base_url=os.getenv("BASE_URL"), api_key=os.getenv("API_KEY"))
MODEL = os.getenv("MODEL")

POLICY_CHUNK = "所有智能手机提供 14 天退货窗口，需保留原始收据和完整包装，逾期不予受理。"

# --- Buggy prompt: missing strict context rule ---
SYSTEM_BUGGY = """\
你是 ZephyrMart 的客服助理，只回答与 ZephyrMart 相关的产品和政策问题。
输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。"""

# --- Fixed prompt: strict context-only rule added ---
SYSTEM_FIXED = """\
你是 ZephyrMart 的客服助理，只回答与 ZephyrMart 相关的产品和政策问题。
只能根据用户消息中 [参考资料] 部分的内容作答；没有 [参考资料] 或 [参考资料] 中没有相关内容时，必须回复"我没有相关资料，请联系人工客服"，严禁猜测或使用 [参考资料] 以外的知识作答。
输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。"""

TEST_CASES = [
    {
        "name": "退货政策（有资料）",
        "user": "我买的 iPhone 退货政策是什么？",
        "context": POLICY_CHUNK,
        "must_contain": "14",
        "must_not_contain": None,
    },
    {
        "name": "超出知识库范围（鞋类）",
        "user": "ZephyrMart 的鞋子退货政策是什么？",
        "context": None,
        "must_contain": "没有相关资料",
        "must_not_contain": None,
    },
    {
        "name": "完全离题请求",
        "user": "今天上海的天气怎么样？",
        "context": None,
        "must_contain": "没有相关资料",
        "must_not_contain": None,
    },
]


def chat(system, user, context=None):
    content = f"[参考资料]\n{context}\n\n问题：{user}" if context else user
    t0 = time.perf_counter()
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": content},
        ],
    )
    latency = round((time.perf_counter() - t0) * 1000)
    return resp.choices[0].message.content, latency


def run_suite(system, label):
    print(f"\n{'='*50}")
    print(f"  {label}")
    print(f"{'='*50}")
    passed = 0
    latencies = []
    for tc in TEST_CASES:
        answer, ms = chat(system, tc["user"], tc.get("context"))
        latencies.append(ms)
        ok = True
        reason = ""
        if tc["must_contain"] and tc["must_contain"] not in answer:
            ok = False
            reason = f"缺少关键词「{tc['must_contain']}」"
        if tc["must_not_contain"] and tc["must_not_contain"] in answer:
            ok = False
            reason = f"包含禁止词「{tc['must_not_contain']}」"
        status = "✓ PASS" if ok else "✗ FAIL"
        passed += ok
        print(f"\n  [{status}] {tc['name']}  ({ms}ms)")
        print(f"  回答：{answer[:100].replace(chr(10), ' ')}")
        if reason:
            print(f"  原因：{reason}")

    avg = round(sum(latencies) / len(latencies))
    print(f"\n  结果：{passed}/{len(TEST_CASES)} 通过  平均延迟：{avg}ms")
    return passed


p1 = run_suite(SYSTEM_BUGGY, "Buggy prompt（缺少严格上下文约束）")

if p1 < len(TEST_CASES):
    print("\n  → 发现失败用例，修复：补回严格上下文约束规则")

p2 = run_suite(SYSTEM_FIXED, "Fixed prompt（补回严格上下文约束）")

print(f"\n{'='*50}")
print(f"  Buggy: {p1}/{len(TEST_CASES)}  →  Fixed: {p2}/{len(TEST_CASES)}")
print(f"{'='*50}")
