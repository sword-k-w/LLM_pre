#!/usr/bin/env python3

import json
import os
import sys
import time
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import error, request


HOST = "127.0.0.1"
PORT = 8000
ROOT = Path(__file__).resolve().parent


def build_messages(payload):
    experiment_mode = payload.get("experiment_mode", "baseline")
    system_prompt = (payload.get("system_prompt") or "").strip()
    user_query = (payload.get("user_query") or "").strip()
    context_blocks = payload.get("context_blocks") or []

    if not user_query:
        raise ValueError("user_query is required")

    if experiment_mode == "baseline":
        system_prompt = system_prompt or "请直接回答用户问题，不要额外解释。"
    elif experiment_mode == "prompt_optimized":
        system_prompt = system_prompt or (
            "你是课程助教。请用中文回答，先给结论，再给 2-3 个要点；"
            "如果没有把握，请明确说不确定。"
        )
    elif experiment_mode == "context_augmented":
        system_prompt = system_prompt or (
            "你是课程助教。只依据提供的课程资料回答，输出结论和依据；"
            "资料不够时明确说明缺口。"
        )
    elif experiment_mode == "harness_mode":
        system_prompt = system_prompt or (
            "你是课程助教。严格输出三段：结论、证据、风险。"
            "证据只引用提供资料，无法确认的内容必须放进风险部分。"
        )

    messages = [{"role": "system", "content": system_prompt}]

    if context_blocks and experiment_mode != "baseline":
        context_text = "\n\n".join(
            f"[Context {index + 1}]\n{block}" for index, block in enumerate(context_blocks)
        )
        messages.append(
            {
                "role": "user",
                "content": (
                    "以下是可用课程资料，请优先依据这些资料回答。\n\n"
                    f"{context_text}"
                ),
            }
        )

    messages.append({"role": "user", "content": user_query})
    return messages


def call_openai_compatible(payload):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

    body = {
        "model": model,
        "messages": build_messages(payload),
        "temperature": 0.2,
    }

    endpoint = f"{base_url}/chat/completions"
    data = json.dumps(body).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    started_at = time.perf_counter()
    req = request.Request(endpoint, data=data, headers=headers, method="POST")

    try:
        with request.urlopen(req, timeout=45) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Upstream HTTP {exc.code}: {body}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Network error: {exc.reason}") from exc

    latency_ms = round((time.perf_counter() - started_at) * 1000)
    choices = response_data.get("choices") or []
    if not choices:
        raise RuntimeError("Upstream returned no choices")

    content = choices[0].get("message", {}).get("content", "")
    if not content:
        raise RuntimeError("Upstream returned empty content")

    return {
      "answer": content,
      "latency_ms": latency_ms,
      "mode_used": payload.get("experiment_mode", "baseline"),
      "fallback_used": False,
    }


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            result = call_openai_compatible(payload)
            self.send_json(HTTPStatus.OK, result)
        except ValueError as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
        except RuntimeError as exc:
            self.send_json(
                HTTPStatus.OK,
                {
                    "error": str(exc),
                    "fallback_used": False,
                    "upstream_available": False,
                    "mode_used": payload.get("experiment_mode", "baseline")
                    if isinstance(payload, dict)
                    else "baseline",
                },
            )

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        sys.stderr.write(f"[server] {format % args}\n")


def main():
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Serving {ROOT} on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
