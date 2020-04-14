import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok, fail
from trump.query import get_items

async def ls(app, request):
    uuid = request.get('uuid')
    #roles = request['user']['role_code']
    #request.args['type'] = ('single',)
    #request.args['permission-overlap'] = (','.join(roles),)
    pass

async def post(app, request):
    if request.json.get('roles') and request.json.get('name'):
        roles = await get_items(app.pool, 'roles')
        role_desc = {str(i.get('id')): i.get('role_code') for i in roles}
        permission = set()
        for i in request.json['roles'].keys():
            if request.json['roles'][i]:
                permission.add(role_desc[i])
        if len(permission) < 1: return fail('权限不为空')
        request.json.pop('roles')
        request.json['permission'] = permission
    else:return fail('Name OR 权限 不能为空')
    request.json['type'] = 'internal'
    pass

async def get(app, request, oid):
    pass

async def put(app, request, oid):
    if str(request.json.get('type')) != 'None':
        request.json['type'] = 'single' if request.json.get('type') else 'internal'
    elif request.json.get('runner_items'):
        runner_items = []
        for i in request.json['runner_items']:
            runner_items.append(i['id'])
        request.json['runner_items'] = runner_items
    elif request.json.get('roles') and request.json.get('name'):
        roles = await get_items(app.pool, 'roles')
        role_desc = {str(i.get('id')): i.get('role_code') for i in roles}
        permission = []
        for i in request.json['roles'].keys():
            if request.json['roles'][i]:
                permission.append(role_desc[i])
        if len(permission) < 1: return fail('权限不为空')
        request.json.pop('roles')
        request.json['permission'] = permission
    else: return fail("Name不能为空")

async def delete(app, request, oid):
    pass

async def post_ls(app, request, data):
    roles = await get_items(app.pool, 'roles')
    role_desc  = {i.get('role_code'):i.get('role_desc')for i in roles}
    for i, runner_item in enumerate(data):
        roles_view = []
        for v, view in enumerate(runner_item['permission']):
            roles_view.append(role_desc[view])
        data[i]['permission'] = roles_view
    pass