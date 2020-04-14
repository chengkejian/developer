from trump.utils import ok, fail
from funcs import executer


#async def ls(app, request):
async def get(app, request, oid):
    result = await executer.run(app, request, int(oid))
    return ok(result)
