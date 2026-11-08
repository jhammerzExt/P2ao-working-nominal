#!/data/data/com.termux/files/usr/bin/bash
# Emergency Obfuscate: Kill, Shred, Rename
pkill -f nexus_core.py || true
pkill -f nexus_gateway.py || true
pkill -f llama-server || true
dd if=/dev/urandom of=/dev/shm/swarm_memory bs=1M count=10 || true
mv "${HOME}/aurelius-swarm/bin/aurelius" "${HOME}/aurelius-swarm/bin/.system-log-parser"
echo "Obfuscation complete. Sovereign state hidden."
