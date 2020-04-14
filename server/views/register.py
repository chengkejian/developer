from sanic.response import json, text, html
from trump.decorators import anonymous, cors
from trump.utils import ok, fail
from trump.query import create_item


@anonymous
async def post(app, request):
    keys = request.json.keys()
    for c in ['name', 'password', 'mobile']:
        if c not in keys:
            return fail('miss')
    user = dict(request.json).copy()
    if 'id' in user.keys():
        user.pop('id')
    user['status'] = 0
    user['key'] = app.fernet.encrypt(request.json['password'])
    await create_item(app.pool, 'users', user)
    return ok('OK')
