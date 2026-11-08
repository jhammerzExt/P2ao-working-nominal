#!/usr/bin/env bash
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
export OLLAMA_MODELS="$INSTALL_DIR/data/ollama_models"
mkdir -p "$OLLAMA_MODELS"

OLLAMA_BIN="$(command -v ollama 2>/dev/null || echo "$INSTALL_DIR/bin/ollama")"

if [ ! -x "$OLLAMA_BIN" ]; then
  bash "$INSTALL_DIR/bin/setup-ollama.sh"
  OLLAMA_BIN="$(command -v ollama 2>/dev/null || echo "$INSTALL_DIR/bin/ollama")"
fi

echo "Starting Real Offline Ollama Daemon on 127.0.0.1:11434..."
exec "$OLLAMA_BIN" serve
