import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok
from trump import log


@no_pager
async def ls(app, request):
    uuid = request.get('uuid')
    pass

async def post(app, request):
    if request.json.get('id'): request.json.pop('id')
    request.json['uid'] = request['user'].get('id')

async def put(app, request, oid):
    pass

async def get(app, request, oid):
    pass
