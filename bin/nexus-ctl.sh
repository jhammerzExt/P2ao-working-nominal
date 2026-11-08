#!/usr/bin/env bash
# Sovereign Nexus Controller

ACTION="${1:-status}"
BIN_DIR="$(cd "$(dirname "$0")" && pwd)"
HOME_DIR="$(cd "$BIN_DIR/.." && pwd)"

case "$ACTION" in
  start)
    echo "Launching Sovereign Triad daemons..."
    nohup python3 "$BIN_DIR/nexus_core.py" > "$HOME_DIR/data/nexus.log" 2>&1 &
    nohup python3 "$BIN_DIR/nexus_gateway.py" > "$HOME_DIR/data/gateway.log" 2>&1 &
    nohup python3 "$BIN_DIR/bridge-cli.py" > "$HOME_DIR/data/bridge.log" 2>&1 &
    echo "✓ Daemons dispatched."
    ;;
  stop)
    echo "Halting Sovereign threads..."
    pkill -f "nexus_core.py" || true
    pkill -f "nexus_gateway.py" || true
    pkill -f "bridge-cli.py" || true
    echo "✓ Threads purged."
    ;;
  status)
    echo "--- Swarm Thread Status ---"
    pgrep -f "nexus_core.py" >/dev/null && echo "Nexus Core:    RUNNING" || echo "Nexus Core:    STOPPED"
    pgrep -f "nexus_gateway.py" >/dev/null && echo "Nexus Gateway: RUNNING" || echo "Nexus Gateway: STOPPED"
    pgrep -f "bridge-cli.py" >/dev/null && echo "Bridge CLI:    RUNNING" || echo "Bridge CLI:    STOPPED"
    ;;
  *)
    echo "Usage: nexus-ctl {start|stop|status}"
    ;;
esac
