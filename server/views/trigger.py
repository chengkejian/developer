from sanic.response import json, text, html
from trump.decorators import anonymous, cors
from trump.utils import ok, fail
from trump.query import get_items
from funcs import executer


@anonymous
async def post(app, request):

    try:
        request.args.get('key')
    except:
        return fail('error data')
    #keys = request.json.keys()
    # for c in ['name', 'password']:
    #     if c not in keys:
    #         return fail('miss')
    triggers = await get_items(app.pool, 'external_triggers', {'token': request.args.get('key')})
    for i in triggers:
        print(i)
        print(await executer.run(app, request, i.get('action_id')))
        return ok('OK')
    # if users:
    #     request['session']['user'] = users[0]
    #     return ok('OK')

    return fail('error')

