#!/usr/bin/env python3
import hmac, hashlib, subprocess, json, sys
from http.server import HTTPServer, BaseHTTPRequestHandler

SECRET = "0x40aba554235e7964da35ae2d960c7482".encode()

class BridgeHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        sig = self.headers.get('X-Hub-Signature-256')
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        
        if not hmac.compare_digest(hmac.new(SECRET, body, hashlib.sha256).hexdigest(), sig or ""):
            self.send_error(403, "Invalid Provenance Signature")
            return

        cmd = json.loads(body).get('command')
        try:
            output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(output)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())

HTTPServer(('127.0.0.1', 3085), BridgeHandler).serve_forever()
