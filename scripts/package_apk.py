#!/usr/bin/env python3
"""
🏛️ AURELIUS & LYSANDER SOVEREIGN MATRIX — STANDALONE APK PACKAGER
Master Architect: Joshua Hamilton (JHammerZ) · UID 0
Delegates to build_sovereign_apk to produce 100% valid Binary-XML signed APKs.
"""

import sys
import os

try:
    from build_sovereign_apk import build_sovereign_apk
except ImportError:
    sys.path.append(os.path.dirname(__file__))
    from build_sovereign_apk import build_sovereign_apk

def create_apk(output_apk_path, project_root=None):
    if not project_root:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    os.makedirs(os.path.dirname(os.path.abspath(output_apk_path)), exist_ok=True)
    build_sovereign_apk(output_apk_path, project_root)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 package_apk.py <output_apk_path> [project_root]")
        sys.exit(1)
    
    target_apk = sys.argv[1]
    root = sys.argv[2] if len(sys.argv) > 2 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    create_apk(target_apk, root)
