import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok, fail, uuid_info
from trump import log
from funcs.git_tag import git_tags
from trump.query import get_item, modify_item

async def ls(app, request):
    uuid = request.get('uuid')
    pass

async def get(app, request, oid):
    uuid = request.get('uuid')
    project = await get_item(app.pool, 'project', oid, column='item', **uuid_info(request))
    print(project)
    return ok(git_tags(project.get('git')))
