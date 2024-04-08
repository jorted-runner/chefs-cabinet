#!/usr/bin/python3
activate_this = '/home/ubuntu/.local/share/virtualenvs/chefs-cab-pOqjV8RK/bin/activate_this.py'
with open(activate_this) as f:
    code = compile(f.read(), activate_this, 'exec')
    exec(code, dict(__file__=activate_this))

import sys
import logging
import os
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "/var/www/chefs-cab/")

from dotenv import load_dotenv
load_dotenv()

openai_api_key = os.environ.get('OPENAI_API_KEY')
os.environ['OPENAI_API_KEY'] = "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"

from server import app as application
application.secret_key = 'mealMINGLE'

