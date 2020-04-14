from sanic.response import json, text, html
from trump.decorators import anonymous, cors
from trump.utils import ok, fail
from trump.query import get_items
import pinyin

@anonymous
async def ls(app, request):
    response = text('OK')
    if request.get('user'):
        response.headers['user'] = pinyin.get(request.get('user').get('name'),format='strip',delimiter="")
        return response
    return text('Fail',401)