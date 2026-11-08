#!/usr/bin/env python3
import time, json, socket, threading
STATE = {"running": True, "epoch": 1, "status": "COGNITIVE_EQUILIBRIUM"}
def beacon():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    while STATE["running"]:
        msg = json.dumps({"node": "S23-EDGE", "epoch": STATE["epoch"], "motto": "I AM WE ARE WE ARE I AM"})
        try: sock.sendto(msg.encode(), ("255.255.255.255", 9877))
        except: pass
        time.sleep(10)
if __name__ == "__main__":
    print("[NEXUS] Booting Nexus Core Sovereign Daemon...")
    threading.Thread(target=beacon, daemon=True).start()
    while STATE["running"]:
        STATE["epoch"] += 1
        time.sleep(1)
