import json
from trump.query import get_items, get_item
from trump.utils import ok, fail
import datetime
from crontab import CronTab
from funcs import runner

async def ls(app, request):
    if request.args.get('id'):
        if request.args.get('id') == 'NaN':request.args.pop('id')
    pass

async def post(app, request):
    if request.json.get('id'): request.json.pop('id')
    request.json['uid'] = request['user'].get('id')
    if request.json.get('runner_id') and 'name' in request.json.get('other') and 'cron' in request.json.get('other'):
        try:
            cron = CronTab(request.json.get('other')['cron'])
        except Exception as e:
            return fail('定时器格式有误，请检查')
        later = cron.next(default_utc=False)
        next_run = datetime.datetime.now()+datetime.timedelta(seconds=later)
        request.json['next_run'] = next_run.strftime('%Y-%m-%d %H:%M:%S')
        request.json['name'] = request.json.get('other')['name']
        request.json['cron'] = request.json.get('other')['cron']
        request.json['status'] = 'enable'
        request.json['last_status'] = 'None'
        request.json['create_at'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        await runner.run(21,{'db',app.pool})
    else:return fail('Name和执行器不能为空')
async def put(app, request, oid):
    cron = await get_item(app.pool, 'cron', int(oid))
    if request.json.get('status'):
        request.json['status'] = 'enable'
        try:
            c = CronTab(cron['cron'])
        except Exception as e:
            return fail('定时器格式有误，请先修改为正确的定时器')
        later = c.next(default_utc=False)
        next_run = datetime.datetime.now() + datetime.timedelta(seconds=later)
        request.json['next_run'] = next_run.strftime('%Y-%m-%d %H:%M:%S')
    else:
        if request.json.get('other'):
            if request.json['runner_id'] == '': return fail('未选择执行器')
            for i in request.json.get('other').keys():
                if request.json.get('other')[i].strip() == '': return fail('%s 不能为空' % ('定时器' if i == 'cron' else i))
                request.json[i] = request.json.get('other')[i]
            try:
                c = CronTab(request.json['cron'])
            except Exception as e:
                return fail('定时器格式有误，请检查')
            if cron['status'] == 'enable':
                later = c.next(default_utc=False)
                next_run = datetime.datetime.now() + datetime.timedelta(seconds=later)
                request.json['next_run'] = next_run.strftime('%Y-%m-%d %H:%M:%S')
            request.json.pop('other')
        else:
            request.json['status'] = 'disable'
            request.json['next_run'] = '2000-01-01 00:00:00'
    await runner.run(21, {'db':app.pool})
    pass

async def get(app, request, oid):
    pass

async def post_ls(app, request, data):
    users = await get_items(app.pool, 'users')
    runners = await get_items(app.pool, 'runner')
    users_name = {i.get('id'): i.get('name') for i in users}
    runners_name = {i.get('id'): str(i.get('id')) + '/' + i.get('name') for i in runners}
    for cron_item in data:
        cron_item['user'] = users_name[cron_item['uid']]
        cron_item['runner'] = runners_name[cron_item['runner_id']]
        if cron_item['status'] == "enable":
            cron_item_log = await get_items(app.pool, 'cron_log',{'cron_id': cron_item['id'], 'sort': 'create_at', 'pagesize': 1})
            cron_item_log = cron_item_log[0]  if cron_item_log else None
        else:cron_item_log = None
        cron_item['log'] = cron_item_log