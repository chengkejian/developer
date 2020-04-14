from trump.utils import ok, fail
import runners
async def ls(app, request):
    if request.args.get('id'):
        if request.args.get('id') == 'NaN':request.args.pop('id')
    pass
async def post(app, request):
    args = request.json.get('other')
    if args.get('title',False) and args.get('runner',False) and args.get('content',False) and args.get('result_mapper',False) and args.get('async',False):
        for i in args.keys():
            if args[i].strip() == '': return fail('%s 不能为空' % (i))
            request.json[i] = args[i]
        request.json['async'] = True if request.json['async'] == 'True' else False
        request.json.pop('other')
    else:return fail('参数不能为空')

async def put(app, request, oid):
    for i in request.json.get('other').keys():
        if request.json.get('other')[i].strip() == '': return fail('%s 不能为空' % (i))
        request.json[i] = request.json.get('other')[i]
    if request.json.get('async'):
        request.json['async'] = True if request.json['async'] == 'True' else False
    request.json.pop('other')

async def post_ls(app, request, data):
    actuator = []
    for i in dir(runners):
        actuator.append(i) if not i.startswith('__') else []
    data.extras['actuator'] = actuator
    pass