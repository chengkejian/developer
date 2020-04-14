import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok
from trump import log
import ast


@no_pager
async def ls(app, request):
    uuid = request.get('uuid')
    roles = request['user']['role_code']
    request.args['type'] = ('single',)
    request.args['permission-overlap'] = (','.join(roles),)
    pass

async def post(app, request):
    pass

async def get(app, request, oid):
    pass

async def put(app, request, oid):
    pass

async def delete(app, request, oid):
    pass
