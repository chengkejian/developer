import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok
from trump import log
from trump.utils import ok, fail
from trump.query import get_items
__table__ = 'jobs'

async def ls(app, request):
    uuid = request.get('uuid')


async def post(app, request):
    if request.json.get('roles') and 'name' in request.json.get('other') and 'executer_id' in request.json.get('other'):
        roles_view = set()
        for i in request.json['roles'].keys():
            roles_view.add(i) if request.json['roles'][i] else []
        if len(roles_view) < 1: return fail('权限为必填')
        request.json['roles_view'] = roles_view
        request.json.pop('roles')
        request.json['name'] = request.json.get('other')['name']
        request.json['executer_id'] = request.json.get('other')['executer_id']
        request.json.pop('other')
        request.json['status'] = 'true'
    else: return fail('参数不能为空')



async def put(app, request, oid):
    if str(request.json.get('status')) != 'None':
        request.json['status'] = str(request.json['status']).lower()
    if request.json.get('roles') and 'name' in request.json.get('other') and 'executer_id' in request.json.get('other'):
        roles = await get_items(app.pool, 'roles')
        role_desc = {str(i.get('id')): i.get('role_code') for i in roles}
        roles_view = set()
        for i in request.json['roles'].keys():
            if request.json['roles'][i]:
                roles_view.add(role_desc[i])
        if len(roles_view) < 1: return fail('权限不为空')
        request.json.pop('roles')
        request.json['roles_view'] = roles_view
        for i in request.json['other'].keys():
            request.json[i] = request.json['other'][i]
        request.json.pop('other')
    else:
        return fail('参数不能为空')
    pass

async def get(app, request, oid):
    pass

async def post_ls(app, request, data):
    roles = await get_items(app.pool, 'roles')
    role_desc  = {i.get('role_code'):i.get('role_desc')for i in roles}
    for i, role_item in enumerate(data):
        roles_view = []
        for v, view in enumerate(role_item['roles_view']):
            roles_view.append(role_desc[view])
        data[i]['roles_view'] = roles_view
    pass

