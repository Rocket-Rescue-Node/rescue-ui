#!/usr/bin/env python3
from html.parser import HTMLParser
import sys
import hashlib
from base64 import b64encode

class ScriptHTMLParser(HTMLParser):
    in_script = False
    shs = set() 

    def handle_starttag(self, tag, attrs):
        if tag != "script":
            return
        if len(list(filter(lambda x: x[0] == "src", attrs))) > 0:
            return
        self.in_script = True

    def handle_data(self, data):
        if self.in_script == False:
            return
        m = hashlib.sha256()
        m.update(data.encode("UTF-8"))
        self.shs.add("'sha256-" + b64encode(m.digest()).decode("UTF-8")+"'")

    def handle_endtag(self, tag):
        self.in_script = False

if len(sys.argv) != 2:
    print("Usage: ./csp-script-header.py [filename]", file=sys.stderr)

filename = sys.argv[1]
with open(filename, 'r') as f:

    parser = ScriptHTMLParser()
    parser.feed(f.read())

    print("\n".join(parser.shs))
