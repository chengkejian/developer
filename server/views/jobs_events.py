# pylint: disable-msg=E0611

import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok, fail
from trump import log
from trump.query import get_items, modify_item, get_item, create_item

from funcs import executer
from funcs import runner
from funcs import project_deploy

async def ls(app, request):
    uuid = request.get('uuid')
    request.args['sort'] = ("id",)
    request.args['event_id'] = (0,)

async def get(app, request, oid):
    uuid = request.get('uuid')

def getStatus(value_map, value):
    #map = {'iOS': 0, 'Android': 1 }
    return value_map.get(value, -1)

async def post(app, request):
    request.json['uid'] = request['user'].get('id')
    request.json['event_id'] = request.json.get('event_id') if request.json.get('event_id') else 0
    #job = await get_item(app.pool, 'jobs', request.json.get('jobs_id'))
    action = await get_item(app.pool, 'jobs_items', int(request.json.get('jobs_item')))
    if type(action.get('arguments')) != list:
        status_mapper = action.get('arguments').get('status_mapper').get('value')
        content = json.loads(request.json.get('content'))
        content.update({'getStatus': getStatus})
        result_code = eval(status_mapper, {"__builtins__" : None }, content)
        if result_code == -1:
            status = 'new'
        else:
            status = action.get('end_status')[result_code]
        request.json['status'] = status
    pass

async def set_status(args, env):
    return (0, [{1:['设置状态',(0,'设置状态')]}], None)

async def run_command(args, env):
    executer_id = args.get('executer_id')
    result = await executer.run(None, {}, executer_id, extra=env)
    return (result.get('status'), result.get('message'), str(result.get('info')), result.get('result_dict'))

async def execute(args, env):
    # env = {'uid': request['user'].get('id'), 'db': app.pool, 'user': request['user'], 'content': json.loads(request.json.get("content")), 'job': job}
    # result_code, result_message, result_info, addons = await run_command({'executer_id': job.get('executer_id')}, env)
    # result_code, result_message, result_info, result_dict = await func(action.get('arguments'), env)
    runner_id = args.get('runner_id')
    result = await runner.run(runner_id, env)
    return (result.get('status'), result.get('message'), result.get('error_info'))

async def deploy(args, env):
    result = await project_deploy.run(args, env)
    return (result.get('status'), result.get('message'), result.get('error_info'))

ACTIONS_FUNCS = {
        'set_status' : set_status,
        'run': run_command,
        'runner': execute,
        'deploy': deploy,
        }

async def put(app, request, oid):
    request.json['uid'] = request['user'].get('id')
    action = await get_item(app.pool, 'jobs_items', request.json.get('action_id'))
    old = await get_item(app.pool, 'jobs_events', int(oid))
    sub_items = await get_items(app.pool, 'jobs_events', {'event_id': old.get('id'), 'sort': '-create_at'})
    old['new_content'] = old['content'].copy()
    for i in sub_items:
        old['status'] = i.get('status')
        if i.get('content'):
            old['new_content'].update(i.get('content'))
    # check status and check permissions 
    diff = set(action.get('roles')) & set(request['user']['role_code'])
    if not diff:
        return fail('无权操作')
    func = ACTIONS_FUNCS.get(action.get('operator'))
    if func:
        if type(action.get('arguments')) == dict:
            _mapper = action.get('arguments').get('args_mapper') if action.get('arguments') else []
        else:
            _mapper = []
        env = {'uid': request['user'].get('id'), 'db': app.pool, 'content': old.get('content'),'new_content': old.get('new_content'), 'request_id': oid, 'args_preprocesser': _mapper, 'data': old}
        result_code, result_message, error_info = await func(action.get('arguments'), env)
        await create_item(app.pool, 'jobs_events', {'uid': request['user'].get('id'), 'event_id': int(oid), 'jobs_id': action.get('id'),
            'status': action.get('end_status')[result_code], 'information': str(result_message)})
        return ok(result_message,return_msg=error_info)
    return fail('出错了')

async def delete(app, request, oid):
    pass


async def post_get(app, request, data, oid):
    roles = request['user']['role_code']
    sub_items = await get_items(app.pool, 'jobs_events', {'event_id': oid, 'sort': '-create_at'})
    data['last_update_at'] = data.get('create_at')
    data['new_content'] = data['content'].copy()
    for i in sub_items:
        data['status'] = i.get('status')
        if i.get('content'):
            data['new_content'].update(i.get('content'))
        data['last_update_at'] = i.get('create_at')
    actions = await get_items(app.pool, 'jobs_items', {'job_id': data.get('jobs_id'), 'start_status': data.get('status'), 'roles-overlap': ','.join(roles)})
    data['actions'] = actions
    data['events'] = sub_items 
    pass

async def post_ls(app, request, data):
    users = await get_items(app.pool, 'users')
    jobs = await get_items(app.pool, 'jobs')
    users_map = { u['id']: u['name'] for u in users}
    status_map = await get_items(app.pool, 'status_map')
    jobs_map = { u['id']: u['name'] for u in jobs}
    jobs_map = { u['id']: u['name'] for u in jobs}
    status_map_map = { u.get('status'): {'name':u.get('dispay_name'), 'color': u.get('color'), 'bgcolor': u.get('bgcolor')} for u in status_map}
    data.extras['toShow'] = [('id', '序号'), 
            ('job_name', '任务名称'), 
            ('title', '任务说明'),
            ('env', '环境'),
            ('user', '发起用户'), 
            ('create_at', '创建时间'), 
            ('last_update_at', '最近处理'), 
            ('status', '状态'), 
            ]
    data.extras['status_map'] = status_map_map
    for d in data:
        sub_items = await get_items(app.pool, 'jobs_events', {'event_id': d['id'], 'sort': '-create_at'})
        d['last_update_at'] = d.get('create_at')
        d['user'] = users_map.get(d.get('uid'))
        d['job_name'] = jobs_map.get(d.get('jobs_id'))
        d['title'] = d.get('content').get('title')
        if d.get('content').get('env'):
            d['env'] = {'gra':'灰度','prd':'生产'}.get(d.get('content').get('env'))
        elif d.get('content').get('db'):
            db = await get_item(app.pool, 'mysql_databases',int(d.get('content').get('db')))
            d['env'] = db.get('name')
        else:d['env'] = 'None'
        for i in sub_items:
            d['status'] = i.get('status')
            d['last_update_at'] = i.get('create_at')

async def post_post(app, request, data):
    if int(request.json.get('event_id', 0)) == 0:
        job = await get_item(app.pool, 'jobs', request.json.get('jobs_id'))
        if job.get('executer_id'):
            env = {'uid': request['user'].get('id'), 'db': app.pool, 'user': request['user'], 'content': json.loads(request.json.get("content")), 'job': job}
            result_code, result_message, result_info, addons = await execute({'runner_id':job.get('executer_id')}, env)
