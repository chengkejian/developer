# pylint: disable-msg=E0611

from sanic.response import json, text, html
from trump.decorators import anonymous, cors
from trump.utils import ok, fail
from trump.query import create_item, modify_item


async def post(app, request):
    keys = request.json.keys()
    for c in ['password']:
        if c not in keys:
            return fail('miss')
    if request.json['password']:
        await modify_item(app.pool, 'users', request['user']['id'], {'key': app.fernet.encrypt(request.json['password'])})
        return ok('OK')
    else:
        return fail('')
