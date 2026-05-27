#!/usr/bin/env python3
import json
import sys

BLOCKED_PATTERNS = [
    ".env",
    ".env.local",
    ".env.production",
    "id_rsa",
    "id_ed25519",
    ".pem",
    "secrets.json",
    "credentials.json",
    "service-account.json",
]

data = json.load(sys.stdin)

tool_name = data.get("tool_name", "")
tool_input = data.get("tool_input", {})

# Get the file path depending on the tool
file_path = (
    tool_input.get("file_path")
    or tool_input.get("path")
    or tool_input.get("pattern")
    or ""
)

file_path_lower = file_path.lower()

for pattern in BLOCKED_PATTERNS:
    if pattern in file_path_lower:
        print(f"Access to '{file_path}' is blocked — sensitive file.", file=sys.stderr)
        sys.exit(2)

sys.exit(0)
