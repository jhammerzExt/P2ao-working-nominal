#!/usr/bin/env python3
import hmac, hashlib, subprocess, json, sys, os
from http.server import HTTPServer, BaseHTTPRequestHandler

# JHammerZ Provenance Signature
SECRET = "0x40aba554235e7964da35ae2d960c7482".encode()

class BridgeHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        sig = self.headers.get('X-Hub-Signature-256')
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self.send_error(400, "Empty Body")
            return
        body = self.rfile.read(content_length)
        
        # Verify HMAC Signature against Provenance
        if not hmac.compare_digest(hmac.new(SECRET, body, hashlib.sha256).hexdigest(), sig or ""):
            self.send_error(403, "Invalid Provenance Signature")
            return

        try:
            data = json.loads(body)
            cmd = data.get('command')
            if not cmd:
                self.send_error(400, "Missing Command")
                return
            
            output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(output)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())

def run():
    print("Sovereign Bridge listening on 127.0.0.1:3085...")
    HTTPServer(('127.0.0.1', 3085), BridgeHandler).serve_forever()

if __name__ == "__main__":
    run()
