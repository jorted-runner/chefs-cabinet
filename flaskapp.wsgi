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

from env_file import EnvFile

env = EnvFile('/var/www/chefs-cab/.env')
env.load()

openai_api_key = env.get('OPENAI_API_KEY')
os.environ['OPENAI_API_KEY'] = openai_api_key

os.environ['SECRET_KEY'] = env.get('SECRET_KEY')
os.environ['AI_ORG'] = env.get('AI_ORG')

os.environ['AWS_ACCESS_KEY'] = env.get('AWS_ACCESS_KEY')
os.environ['AWS_SECRET_ACCESS_KEY'] = env.get('AWS_SECRET_ACCESS_KEY')

os.environ['AWS_BUCKET'] = env.get('AWS_BUCKET')
os.environ['AWS_REGION'] = env.get('AWS_REGION')

os.environ['ADMIN_EMAIL'] = env.get('ADMIN_EMAIL')

from server import app as application
application.secret_key = env.get('SECRET_KEY')

