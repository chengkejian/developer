import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok, fail
from trump import log
from funcs.git_tag import git_tags
from trump.query import get_items, modify_item

async def ls(app, request):
    if request.args.get('job_id'):
        if request.args.get('job_id') == 'NaN':request.args.pop('job_id')
    pass

async def get(app, request, oid):
    uuid = request.get('uuid')
    pass

def is_complete (other):
    for i in ['job_id','start_status','operator','arguments','end_status','name']:
        if other.get(i) and other.get(i) != '':
            pass
        else: return False
    return True
async def post(app, request):
    if request.json.get('roles') and is_complete(request.json['other']):
        roles_view = set()
        for i in request.json['roles'].keys():
            roles_view.add(i) if request.json['roles'][i] else []
        if len(roles_view) < 1: return fail('权限为必填')
        request.json.pop('roles')
        request.json['roles'] = roles_view
        for k in request.json.get('other').keys():
            request.json[k] = request.json.get('other')[k]
        # request.json['arguments'] = json.dumps(request.json['arguments'])
        request.json['end_status'] = set(request.json['end_status'])
        request.json.pop('other')
    else: return fail('所有参数不能为空')

async def put(app, request, oid):
        roles = await get_items(app.pool, 'roles')
        role_desc = {str(i.get('id')): i.get('role_code') for i in roles}
        roles_view = set()
        for i in request.json['roles'].keys():
            roles_view.add(role_desc[i]) if request.json['roles'][i] else []
        if len(roles_view) < 1: return fail('权限为必填')
        request.json.pop('roles')
        request.json['roles'] = roles_view
        for k in request.json.get('other').keys():
            if request.json.get('other')[k].strip() == '': return fail('%s 不能为空' %(k))
            request.json[k] = str(request.json.get('other')[k])
        if request.json.get('end_status') : request.json['end_status'] = set(request.json['end_status'])
        request.json.pop('other')


async def delete(app, request, oid):
    pass

async def post_ls(app, request, data):
    roles = await get_items(app.pool, 'roles')
    role_desc = {i.get('role_code'): i.get('role_desc') for i in roles}
    for i, role_item in enumerate(data):
        roles_view = []
        for v, view in enumerate(role_item['roles']):
            if view == 'ALL':
                roles_view = role_desc.values()
            else:
                roles_view.append(role_desc[view])
        data[i]['roles'] = roles_view
        data[i]['arg'] = data[i]['arguments']
        data[i].pop('arguments')
    pass

async def post_get(app, request, data, oid):
    if data.get('operator') == 'create_content':
        #arguments = json.loads(data.get('arguments'))
        arguments = data.get('arguments')
        print("AAA", arguments)
        if type(arguments) != list:
            arguments = data.get('arguments').get('content')
        for i, arg in enumerate(arguments.copy()):
            if arg.get('data') == 'db':
                arg['values'] = await get_items(app.pool, arg.get('table'), arg.get('args', {}))
                arguments[i] = arg
            elif arg.get('data') == 'array':
                arg['values'] = [{ 'id':v, 'name': k} for k,v in arg.get('source')]
                arguments[i] = arg
            elif arg.get('data') == 'git_tags':
                project = await get_items(app.pool, arg.get('table'), arg.get('args', {}))
                git_url = project[0]['git']
                arg['values'] = git_tags(git_url)
                arguments[i] = arg
            elif arg.get('data') == 'list':
                project_return_item_list = await get_items(app.pool, arg.get('table'), arg.get('args', {}))
                arg['values'] = [i.get("item") for i in project_return_item_list]
                arguments[i] = arg
        #data['arguments'] = arguments
