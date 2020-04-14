import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok
from trump import log


@no_pager
async def ls(app, request):
    uuid = request.get('uuid')
    request.args['sort'] = ("-proprity,-id",)
    pass

async def post(app, request):
    pass

async def put(app, request, oid):
    pass

async def delete(app, request, oid):
    pass
