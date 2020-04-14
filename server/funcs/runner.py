from trump.query import get_items, modify_item, get_item, create_item
import json
import runners
async def run(runner_id, context):
    ''' 1,
    context.get('db')
    '''
    #uuid = context.get('uuid')
    db = context.get('db')
    #uid = context.get('uid', -1)
    runner = await get_item(db, 'runner', runner_id)
    variables = context.get('data', {}).get('content', {}).copy()
    variables['result'] = []
    _context = context.copy()
    command_status = 0
    for i in runner.get('runner_items'):
        command = await get_item(db, 'runner_items', i)
        cmd = command.get('runner')
        _id = command.get('id')
        cmd_title = command.get('title')
        content = command.get('content') if command.get('content') else variables.get('content')
        if command_status ==0:
            if cmd == 'aliyun_slb':
                result = await getattr(runners, cmd).main(json.loads(content))
            else:result = await getattr(runners, cmd).main(content, variables, _context)
            variables['status'] = command_status
        else:
            if command.get('runner') == 'dingding':
                result = await getattr(runners, cmd).main(content, variables, _context)
                variables['status'] = 1
            else:
                continue
        command_status = result[0]
        variables['result'].append({_id: [cmd_title, result]})
        if  command_status != 0 and command.get('runner') != 'dingding':
            variables['status'] = command_status
            variables['error_info'] = {_id: [cmd_title, result]}
    variables['message'] = variables['result']
    return variables
