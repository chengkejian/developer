import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok
from trump import log
from trump.query import get_items, modify_item


async def ls(app, request):
    uuid = request.get('uuid')
    roles = request['user']['role_code']
    request.args['roles_view-overlap'] = (','.join(roles),)
    pass

async def post(app, request):
    pass

async def put(app, request, oid):
    pass

async def delete(app, request, oid):
    pass

async def post_ls(app, request, data):
    items = await get_items(app.pool, 'jobs_items', {'start_status': 'entrypoint'})
    data.extras['hidden'] = ('id', 'permission', 'create_at','action', 'entrypoint_id', 'executer_id', 'roles_view', 'status')
    for d in data:
        entrypoint_item = list(filter(lambda i: i['job_id'] == d['id'], items))
        if entrypoint_item:
            d['action'] = entrypoint_item[0].get('name')
            d['entrypoint_id'] = entrypoint_item[0].get('id')
