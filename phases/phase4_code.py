"""
Phase 4: Harness Engineering — code generation + feedback loop.

Task: parse ZephyrMart receipt text into structured data.
Edge cases: full-width × vs ASCII x, extra whitespace, empty lines.
"""

import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(base_url=os.getenv("BASE_URL"), api_key=os.getenv("API_KEY"))
MODEL = os.getenv("MODEL")

# ── Task prompt (intentionally omits the × vs x edge case) ──────────────────
TASK_V1 = """\
请用 Python 实现函数：

    def parse_receipt(text: str) -> list[dict]

解析 ZephyrMart 收据文本，每行格式为：
    <商品名> × <数量> @ ¥<单价>

返回列表，每个元素为：
    {"name": str, "qty": int, "unit_price": float, "subtotal": float}

忽略空行。只输出函数代码，不要注释，不要示例。"""

SYSTEM = "你是一个 Python 工程师，只输出代码，不要解释。"

# ── Test cases ───────────────────────────────────────────────────────────────
TEST_CASES = [
    {
        "label": "基础：× 分隔符",
        "input": "iPhone 14 Pro × 2 @ ¥8999.00",
        "expected": [
            {"name": "iPhone 14 Pro", "qty": 2, "unit_price": 8999.0, "subtotal": 17998.0}
        ],
    },
    {
        "label": "ASCII x 替代 ×",
        "input": "蓝牙音箱 x 1 @ ¥399.00",
        "expected": [
            {"name": "蓝牙音箱", "qty": 1, "unit_price": 399.0, "subtotal": 399.0}
        ],
    },
    {
        "label": "多余空格",
        "input": "充电线  ×  3 @ ¥129.00",
        "expected": [
            {"name": "充电线", "qty": 3, "unit_price": 129.0, "subtotal": 387.0}
        ],
    },
    {
        "label": "多行 + 空行",
        "input": "iPhone 14 Pro × 2 @ ¥8999.00\n\n蓝牙音箱 × 1 @ ¥399.00",
        "expected": [
            {"name": "iPhone 14 Pro", "qty": 2, "unit_price": 8999.0, "subtotal": 17998.0},
            {"name": "蓝牙音箱", "qty": 1, "unit_price": 399.0, "subtotal": 399.0},
        ],
    },
    {
        "label": "全为空行",
        "input": "\n\n\n",
        "expected": [],
    },
]


def extract_code(response: str) -> str:
    if "```python" in response:
        return response.split("```python")[1].split("```")[0].strip()
    if "```" in response:
        return response.split("```")[1].split("```")[0].strip()
    return response.strip()


def run_tests(code: str) -> list:
    ns = {}
    try:
        exec(code, ns)
    except Exception as e:
        return [f"代码执行失败：{e}"]
    fn = ns.get("parse_receipt")
    if fn is None:
        return ["未找到函数 parse_receipt"]

    failures = []
    for tc in TEST_CASES:
        try:
            result = fn(tc["input"])
            if result != tc["expected"]:
                failures.append(
                    f'[{tc["label"]}]\n'
                    f'  输入：{repr(tc["input"])}\n'
                    f'  返回：{result}\n'
                    f'  期望：{tc["expected"]}'
                )
        except Exception as e:
            failures.append(
                f'[{tc["label"]}]\n'
                f'  输入：{repr(tc["input"])}\n'
                f'  抛出异常：{e}'
            )
    return failures


def chat(messages):
    resp = client.chat.completions.create(model=MODEL, messages=messages)
    return resp.choices[0].message.content


SEP = "=" * 54

# ── Attempt 1 ────────────────────────────────────────────────────────────────
print(f"\n{SEP}")
print("  Harness: 代码生成 + 反馈循环")
print(SEP)

messages = [
    {"role": "system", "content": SYSTEM},
    {"role": "user",   "content": TASK_V1},
]

print("\n[第 1 次] 模型输出：\n")
resp1 = chat(messages)
code1 = extract_code(resp1)
print(code1)

failures1 = run_tests(code1)
print(f"\n[Harness 测试结果]")
if not failures1:
    print(f"  ✓ 全部 {len(TEST_CASES)}/{len(TEST_CASES)} 通过，无需重试")
    print(f"\n{SEP}\n  结果：1 次即通过\n{SEP}")
    sys.exit(0)

for f in failures1:
    print(f"  ✗ FAIL:\n{f}")
print(f"\n  → {len(failures1)} 个测试失败，注入错误信息重试")

# ── Feedback injection ────────────────────────────────────────────────────────
feedback = "测试失败，请修复函数。失败详情：\n\n" + "\n\n".join(failures1)
messages.append({"role": "assistant", "content": resp1})
messages.append({"role": "user",      "content": feedback})

print(f"\n[反馈注入]\n{feedback}")

# ── Attempt 2 ────────────────────────────────────────────────────────────────
print(f"\n[第 2 次] 模型输出：\n")
resp2 = chat(messages)
code2 = extract_code(resp2)
print(code2)

failures2 = run_tests(code2)
print(f"\n[Harness 测试结果]")
if not failures2:
    for tc in TEST_CASES:
        print(f'  ✓ [{tc["label"]}]')
    p1 = len(TEST_CASES) - len(failures1)
    print(f"\n{SEP}")
    print(f"  第 1 次：{p1}/{len(TEST_CASES)}  →  第 2 次：{len(TEST_CASES)}/{len(TEST_CASES)}")
    print(SEP)
    sys.exit(0)

for f in failures2:
    print(f"  ✗ FAIL:\n{f}")
print(f"\n  → {len(failures2)} 个测试仍然失败，再次注入错误信息重试")

# ── Feedback injection 2 ──────────────────────────────────────────────────────
WHITESPACE_HINT = "\n\n提示：分隔符 × 两侧可能有多个空格，建议用 re.split(r'\\s+[×x]\\s+', line) 替代固定字符串分割。"
feedback2 = "测试仍然失败，请修复函数。失败详情：\n\n" + "\n\n".join(failures2) + WHITESPACE_HINT
messages.append({"role": "assistant", "content": resp2})
messages.append({"role": "user",      "content": feedback2})

print(f"\n[反馈注入]\n{feedback2}")

# ── Attempt 3 ────────────────────────────────────────────────────────────────
print(f"\n[第 3 次] 模型输出：\n")
resp3 = chat(messages)
code3 = extract_code(resp3)
print(code3)

failures3 = run_tests(code3)
print(f"\n[Harness 测试结果]")
if failures3:
    for f in failures3:
        print(f"  ✗ FAIL:\n{f}")
else:
    for tc in TEST_CASES:
        print(f'  ✓ [{tc["label"]}]')

p1 = len(TEST_CASES) - len(failures1)
p2 = len(TEST_CASES) - len(failures2)
p3 = len(TEST_CASES) - len(failures3)
print(f"\n{SEP}")
print(f"  第 1 次：{p1}/{len(TEST_CASES)}  →  第 2 次：{p2}/{len(TEST_CASES)}  →  第 3 次：{p3}/{len(TEST_CASES)}")
print(SEP)
