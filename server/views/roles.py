import json

from trump.decorators import no_pager, anonymous, table_headers
from trump.utils import ok
from trump import log
from trump.query import get_items


async def ls(app, request):
    uuid = request.get('uuid')
