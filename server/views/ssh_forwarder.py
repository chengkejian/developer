from funcs.ssh_forwarder import SshForwarder
import time
import random
from trump.utils import fail, ok
from trump.query import get_items, get_item, modify_item

async def ls(app, request):
    if request.args.get('id'):
        if request.args.get('id') == 'NaN':request.args.pop('id')
    pass
async def sshforwarder(action,args):
    sshforwarder = SshForwarder(base_ip=args['base_ip'], base_port=int(args['base_port']))
    if action == 'create':
        status,result = await sshforwarder.create_forwarder(name=args['container_name'],transpond_ip=args['transpond_ip'],transpond_port=int(args['transpond_port']),
                                                  transpond_user=args['transpond_user'],transpond_passwd=args['transpond_passwd'],transpond_key=args['transpond_key'],
                                                  remote_ip=args['remote_ip'],remote_port=int(args['remote_port']),local_port=int(args['local_port']))
    elif action == 'check':
        result = await sshforwarder.check_forwarder(args['container_name'])
    elif action == 'restart':
        result = await sshforwarder.restart_forwarder(args['container_name'])
    else:
        result = await sshforwarder.stop_forwarder(args['container_name'])
    return result
async def post(app, request):
    if request.args.get('action'):
        if request.args.get('action') == 'update':
            ssh = await get_items(app.pool,'ssh_forwarder',{'status':'enable'})
            for i in ssh:
                status_check = await sshforwarder('check',i)
                await modify_item(app.pool,'ssh_forwarder',i.get('id'),{'status_check':status_check})
            return ok('更新完成')
        else:
            status = await sshforwarder('restart',request.json)
            return ok('重启完成') if status else fail('重启失败')
    required = {'transpond_ip':'转发主机 IP','transpond_port':'转发主机 Port','transpond_user':'转发主机 User',
                'remote_ip':'目标主机 IP','remote_port':'目标主机 Port','local_port':'本地 Port','comment':'转发说明'}
    args = request.json.get('other')
    for i in list(required.keys()):
        if args.get(i,'').strip():
            request.json[i] = args[i]
        else:return fail('%s 不能为空' %(required[i]))
    if request.json.get('docker'):
        if args.get('base_ip','').strip() and args.get('base_port','').strip():
            request.json['base_ip'] = args.get('base_ip')
            request.json['base_port'] = args.get('base_port')
        else: return fail('若指定docker主机，则IP 和 Port 不能为空')
    else:
        request.json['base_ip'] = '192.168.1.30'
        request.json['base_port'] = 2375
    if args.get('transpond_passwd','').strip() or args.get('transpond_key','').strip():
        request.json['transpond_passwd'] = args.get('transpond_passwd','')
        request.json['transpond_key'] = args.get('transpond_key', '')
    else: return fail('转发主机 Passwd 或 SSH-Key 至少填一项')
    request.json.pop('docker')
    request.json.pop('other')
    request.json['create_at'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    request.json['container_name'] = 'ssh_forwarder_%s' %(random.randint(1,50))
    request.json['status'] = 'enable'
    request.json['status_check'] = await sshforwarder('create',request.json)

async def put(app, request, oid):
    if 'status' in list(request.json.keys()):
        forwarder = await get_item(app.pool,'ssh_forwarder',int(oid))
        if request.json.get('status'):
            request.json['status'] = 'enable'
            request.json['status_check'] = await sshforwarder('create',forwarder)
        else:
            request.json['status'] = 'disable'
            request.json['status_check'] = 'None'
            await sshforwarder('stop',forwarder)
    else:
        required = {'transpond_ip': '转发主机 IP', 'transpond_port': '转发主机 Port', 'transpond_user': '转发主机 User',
                    'remote_ip': '目标主机 IP', 'remote_port': '目标主机 Port', 'local_port': '本地 Port', 'comment': '转发说明'}
        args = request.json.get('other')
        if request.json.get('docker'):
            if args.get('base_ip', '').strip() and args.get('base_port', '').strip():
                request.json['base_ip'] = args.get('base_ip')
                request.json['base_port'] = args.get('base_port')
            else:
                return fail('若指定docker主机，则IP 和 Port 不能为空')
        if args == {}: return ok()
        for i in list(required.keys()):
            if i in list(args.keys()):
                print(i)
                if args[i].strip():
                    request.json[i] = args[i]
                else:
                    return fail('%s 不能为空' % (required[i]))
        if args.get('transpond_passwd', '').strip() or args.get('transpond_key', '').strip():
            request.json['transpond_passwd'] = args.get('transpond_passwd', '')
            request.json['transpond_key'] = args.get('transpond_key', '')
        else:
            return fail('转发主机 Passwd 或 SSH-Key 至少填一项')
        request.json.pop('other')
        request.json.pop('docker')
    pass

async def post_put(app, request, data, oid):
    forwarder = await get_item(app.pool, 'ssh_forwarder', int(oid))
    if forwarder.get('status') == 'enable' and request.json.get('other'):
        await sshforwarder('stop', forwarder)
        await sshforwarder('create', forwarder)
    pass

async def delete(app, request, oid):
    forwarder = await get_item(app.pool, 'ssh_forwarder', int(oid))
    if forwarder.get('status') == 'enable':
        await sshforwarder('stop', forwarder)
    pass
