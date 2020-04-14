#!/usr/bin/env python
from trump import app
from trump import log
from trump.utils import uuid_info
from trump.query import get_item
from sanic.response import json, html, text
import os
import json
import traceback
from setproctitle import setproctitle
from sanic.websocket import WebSocketProtocol
from cryptography.fernet import Fernet

import inspect

logger = log.Logger(__name__)
# setproctitle("developers")

@app.route('/')
async def index(request):
    msg = request.args.get('msg', '')
    for i in request.app.clients:
        await i.send(msg)
    #await log.info(uuid, __name__, "main")
    #with open("index.html") as f:
    #    return html(f.read().replace('{TITLE}', os.environ.get('ENV', 'None')))
    return html("Hello")

async def loaduser(app, request):
    uid = request.get('session', {}).get('user', {}).get('id')
    request['user'] = await get_item(app.pool, 'users', uid, **uuid_info(request))
    auth_proxy_user = request.headers.get('X-WEBAUTH-USER')
    if not request['user'] and auth_proxy_user:
        request['user'] =  await get_item(app.pool, 'users', auth_proxy_user, column='name', **uuid_info(request))
    print(f"USER:{request['user']}")
    #print(app.fernet.encrypt(request['user'].get('password')))

class Crypto():
    def __init__(self):
        key = b'09aXvR2PiKwMKsusm4IiWKAumuMqeCe5OWWF-KnF8lY='
        self.f = Fernet(key)

    def encrypt(self, string):
        return self.f.encrypt(bytes(string, 'utf8')).decode('utf8')

    def decrypt(self, string):
        return self.f.decrypt(bytes(string, 'utf8')).decode('utf8')


@app.app.listener('before_server_start')
async def add_ws_clients(app, loop):
    app.clients = {}
    app.fernet = Crypto()

@app.app.listener('before_server_stop')
async def clean_ws_clients(app, loop):
    for i in app.clients:
        try:
            await i.close()
        except Exception as e:
            await logger.err(uuid, inspect.currentframe().f_code.co_name, str(e))

@app.app.websocket('/api/feed')
async def feed(request, ws):
    clients = request.app.clients
    clients[ws] = {}
    while True:
        data = 'hello!'
        for i in clients.copy():
            if i.closed:
                clients.pop(i)
            else:
                await i.send(data)
        data = await ws.recv()


if __name__ == '__main__':
    app.url_prefix = '/api'
    app.app.config.REQUEST_TIMEOUT = 600
    app.app.config.RESPONSE_TIMEOUT = 600
    app.restapi.user_loader = loaduser
    app.static('/static', './static')
    app.static('/login', './login.html')
    import os
    if os.name != 'posix':
        app.run(auto_reload=False, protocol=WebSocketProtocol)
    else:
        app.run(protocol=WebSocketProtocol)
