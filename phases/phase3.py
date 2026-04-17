"""
Phase 3: Context Engineering — RAG, lost-in-the-middle, reranking.

3a: inject the right chunk → model answers correctly
3b: bury the key chunk in the middle → model misses it
3c: prepend key fact → model recovers
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

SYSTEM = """\
你是 ZephyrMart 的客服助理，只依据提供的资料回答，不要猜测或编造。
无法确认的信息，回复"我没有相关资料，请联系人工客服"。
输出格式：2 句话，第一句说结论，第二句说建议的下一步操作。不要使用列表或 Markdown。"""

QUESTION = "我买的 iPhone 退货政策是什么？"

CHUNK_POLICY = "所有智能手机提供 14 天退货窗口，需保留原始收据和完整包装。"
CHUNK_HOURS  = "ZephyrMart 门店营业时间为每天 10:00–22:00。"
CHUNK_POINTS = "会员积分可在下次购物时抵扣，有效期 180 天。"


def build_context(*chunks: str) -> str:
    return "\n\n".join(f"[资料 {i+1}]\n{c}" for i, c in enumerate(chunks))


def chat(context: str) -> str:
    user = f"{context}\n\n问题：{QUESTION}"
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user",   "content": user},
        ],
    )
    return response.choices[0].message.content


print("=== 3a: RAG — only the relevant chunk ===")
print(chat(build_context(CHUNK_POLICY)))

print("\n=== 3b: Lost in the Middle — key chunk buried ===")
print(chat(build_context(CHUNK_HOURS, CHUNK_POLICY, CHUNK_POINTS)))

print("\n=== 3c: Reranked — key fact prepended ===")
key_fact = f"关键事实：{CHUNK_POLICY}"
ctx = key_fact + "\n\n" + build_context(CHUNK_POLICY, CHUNK_HOURS, CHUNK_POINTS)
print(chat(ctx))
