"""
Phase 1: Baseline — no system prompt, no context.
Expected: model answers with general knowledge (e.g. Apple's official policy),
ignoring that the question is about ZephyrMart specifically.
"""

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("BASE_URL"),
    api_key=os.getenv("API_KEY"),
)

response = client.chat.completions.create(
    model=os.getenv("MODEL"),
    messages=[
        {"role": "user", "content": "我买的 iPhone 退货政策是什么？"},
    ],
)

print(response.choices[0].message.content)
