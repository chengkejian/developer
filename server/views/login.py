from sanic import response
from trump.decorators import anonymous, cors
from trump.utils import ok, fail
from trump.query import get_items
from sanic.response import json
from tld import get_fld

@anonymous
async def post(app, request):

    keys = request.json.keys()
    for c in ['name', 'password']:
        if c not in keys:
            return fail('参数错误')
    users = await get_items(app.pool, 'users', {'name': request.json['name']})
    if users:
        print(app.fernet.decrypt(users[0]['key']))
        if app.fernet.decrypt(users[0]['key']) == request.json['password']:
            request['session']['user'] = users[0]
            next_go = request.cookies.get('next_go','')
            rep = json({'return_code':'0000','return_msg':next_go})
            if request.cookies.get('next_go'):
                rep.cookies['next_go'] = ''
                rep.cookies['next_go']['domain'] = '.'+get_fld(request.url)
                rep.cookies['next_go']['max-age'] = 0
            return rep

    return fail('用户名或密码错误')

