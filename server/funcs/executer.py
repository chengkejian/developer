import json
from trump.query import get_items, modify_item, get_item, create_item
import inspect
from trump import log

logger = log.Logger(__name__)


async def run(app, request, executer_id, data=None, extra=None):
    uuid = '-'
    if request:
        uuid = request.get('uuid')
    if request.get('user'):
        uid = request.get('user', {}).get('id')
    else:
        uid = -1
    env = {'uid': uid, 'db': app.pool if app else None, 'data': data}
    if extra:
        env.update(extra)
    if env.get('args_preprocesser'):
        for k, v in env.get('args_preprocesser',[]):
            if env.get('data') and env.get('data', {}).get('content'):
                content = env.get('data', {}).get('content')
            else:
                content = {}
            if env.get('new_content'):
                new_content = env.get('new_content')
            else:
                new_content = {}
            try:
                env[k] = eval(v, {"__builtins__" : None }, {'content': content, 'new_content': new_content })
            except:
                await logger.err(uuid, inspect.currentframe().f_code.co_name, (k, v, {'content': content, 'new_content': new_content }))

    from funcs import runners 
    db = env.get('db')
    
    commands = await get_items(db, 'executer_item', {'executer_id': executer_id, 'sort': '-priority,-id'})
    result_dict = {}
    for i, command in enumerate(commands):
        args = env.copy()
        args_value = command.get('args')
        if args_value:
            args.update(args_value)

        cmd = command.get('command')

        args_mapper_value = command.get('args_mapper')
        args_mapper = args_mapper_value if args_mapper_value else {}

        for key, conditions in args_mapper:
            #if eval(condition, {"__builtins__" : None }, result):
            try:
                args[key] = eval(conditions, {"__builtins__" : None }, env)
            except Exception as e:
                await logger.err(uuid, inspect.currentframe().f_code.co_name, (e, key, conditions, env))

        #print("CMD", command)
        #print("ENV", args)
        result = await getattr(runners, cmd).main(args, {})

        result_dict[command.get('id')] = result
        result_mappers_value = command.get('result_mapper')
        result_mappers = result_mappers_value if result_mappers_value else []


        env[cmd+'_result'] = result
        result_env = env.copy()
        result_env.update({'result': result })

        for key, conditions in result_mappers:
            try:
                env[key] = eval(conditions, {"__builtins__" : None }, result_env)
            except Exception as e:
                await logger.err(uuid, inspect.currentframe().f_code.co_name, (e, key, conditions, result_env))
    env['result_dict'] = result_dict
    ###
    # log
    await create_item(db, 'op_logs', {'op': json.dumps({'type':'executer', 'executer_id': executer_id}), 'uid': env['uid']})
    # prepare for result 
    for i in ('db', 'uid', 'data'):
        env.pop(i)
    return env
