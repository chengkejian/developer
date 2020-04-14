from trump.utils import ok, fail
from funcs import runner 


#async def ls(app, request):
async def get(app, request, oid):
    result = await runner.run(int(oid), {'db': request.app.pool, 'uid': request.get('user', {}).get('id'), 'uuid': request.get('uuid')})
    return ok(result)
