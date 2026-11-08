#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
class NexusHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"gateway": "Active", "motto": "I AM WE ARE WE ARE I AM"}).encode())
    def log_message(self, format, *args): pass
if __name__ == "__main__":
    print("[GATEWAY] Nexus REST Gateway active on http://127.0.0.1:3080")
    HTTPServer(("127.0.0.1", 3080), NexusHandler).serve_forever()
