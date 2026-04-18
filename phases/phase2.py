"""
Phase 2: Prompt Engineering — step by step, each sub-step printed separately.

2a: task spec only (role + boundary + refusal rule)
2b: + CoT reasoning guidance
2c: + format control
2d: + one-shot example
"""

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("BASE_URL"),
    api_key=os.getenv("API_KEY"),
)
MODEL = os.getenv("MODEL")


def chat(system: str | None, user: str) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": user})
    response = client.chat.completions.create(model=MODEL, messages=messages)
    return response.choices[0].message.content


QUESTION_SIMPLE = "我买的 iPhone 退货政策是什么？"

PROMO_CONTEXT = """\
[ZephyrMart 促销规则]
- 满 300 减 30
- 满 500 减 80
- 电子产品额外 9 折（折扣在满减之后计算）
- 同一订单只能叠加一档满减，取门槛最高且满足条件的那档"""

QUESTION_COT = (
    "我买了一台 ¥399 的蓝牙音箱和一根 ¥129 的充电线，"
    "请问能享受哪些优惠，最终需要付多少钱？"
)

# --- 2a: task spec ---
SYSTEM_2A = """\
你是 ZephyrMart 的客服助理，只回答与 ZephyrMart 相关的产品和政策问题。
无法确认的信息，回复"我没有相关资料，请联系人工客服"，不要猜测或编造。"""

# --- 2b: + CoT ---
SYSTEM_2B = SYSTEM_2A + """

回答步骤：先逐条列出每个优惠条件是否满足，再计算最终金额，最后给出结论。"""

# --- 2c: + format ---
SYSTEM_2C = SYSTEM_2B + """

输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。"""

# --- 2d: + one-shot (refusal format example) ---
SYSTEM_2D = SYSTEM_2C + """

示例输入：你们有哪些品牌的电视？
示例输出：我没有相关资料，请联系人工客服。您也可以访问 ZephyrMart 官网查看完整商品目录。"""


print("=== 2a: task spec only ===")
print(chat(SYSTEM_2A, QUESTION_SIMPLE))

print("\n=== 2b: + CoT (no-CoT baseline first) ===")
print("-- without CoT --")
print(chat(SYSTEM_2A, f"{PROMO_CONTEXT}\n\n问题：{QUESTION_COT}"))
print("-- with CoT --")
print(chat(SYSTEM_2B, f"{PROMO_CONTEXT}\n\n问题：{QUESTION_COT}"))

print("\n=== 2c: + format control ===")
print(chat(SYSTEM_2C, QUESTION_SIMPLE))

print("\n=== 2d: + one-shot ===")
print(chat(SYSTEM_2D, QUESTION_SIMPLE))
