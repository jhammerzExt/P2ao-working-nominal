#!/data/data/com.termux/files/usr/bin/bash
# 🏛️ SOVEREIGN KERNEL INITIALIZATION HOOK
# 1. Acquire WakeLock, 2. Spawn Triad, 3. Establish Socket
termux-wake-lock
python3 "${HOME}/aurelius-swarm/bin/nexus_core.py" &
nohup python3 "${HOME}/aurelius-swarm/bin/nexus_gateway.py" >/dev/null 2>&1 &
touch /tmp/sovereign.sock
echo "Sovereign Kernel Active. UID 0 Handshake Persistent."
