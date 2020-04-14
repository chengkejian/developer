# pylint: disable-msg=E0611

from sanic import response
import asyncio
import subprocess
from trump.query import create_item, get_item
from trump.config import DB_CONFIG
import base64
import paramiko

def run_cmd(host, env, custom_args={}):
    args = {'host_id': 'host_id', 'cmd': 'cmd', 'db': 'db'}
    args.update(custom_args)
    print(env)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host.get('ssh_ip'), username=host.get('ssh_user'), port=host.get('ssh_port'), key_filename="./resources/id_rsa", timeout=10)
    stdin, stdout, stderr = client.exec_command(env.get(args.get('cmd')), timeout=10)
    #stdin, stdout, stderr = client.exec_command(env.get(args.get('cmd')), timeout=10)
    exit_status = stdout.channel.recv_exit_status()
    #chan = client.get_transport().open_session()
    #chan.exec_command(env.get(args.get('cmd')))
    # stdout = ''
    # stderr = ''
    # exit_status = -2
    # while True:
    #     if chan.recv_ready():
    #         out = chan.recv(4096).decode('ascii')
    #         print("recv:\n%s" % out)
    #         stdout += out
    #     if chan.recv_stderr_ready():
    #         err = chan.recv_stderr(4096).decode('ascii')
    #         print("error:\n%s" % err)
    #         stderr += err
    #     if chan.exit_status_ready():
    #         exit_status = chan.recv_exit_status()
    #         print("exit status: %s" % exit_status)
    #         break
    #         client.close()
    result = ''
    errs = ''
    for line in stdout:
    	result += line
    	print('... ' + line.strip('\n'))
    for line in stderr:
    	errs += line
    	print(',,, ' + line.strip('\n'))
    if exit_status == 0:
    	print ("Success")
    else:
    	print("Error", exit_status)
    #stdin, stdout, stderr = client.exec_command('ls -l')
    #exit_status = stdout.channel.recv_exit_status()
    #for line in stdout:
    #	print('... ' + line.strip('\n'))
    #if exit_status == 0:
    #	print ("Success")
    #else:
    #	print("Error", exit_status)
    client.close()
    print ("Closed")
    return exit_status, errs, result

async def main(env, custom_args={}):
    args = {'host_id': 'host_id', 'cmd': 'cmd', 'db': 'db'}
    args.update(custom_args)
    host = (await get_item(
        env.get(args.get('db')),
        'servers',
        int(env.get(args.get('host_id')))
        ))
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
            None, run_cmd, host, env, custom_args)
    return result


async def run_helper():
    from trump.config import DB_CONFIG
    from trump.query import create_item, get_items, create_pools
    loop = asyncio.get_event_loop()
    db = await create_pools(loop, **DB_CONFIG)
    result = await main({
        'host_id': 1,
        'cmd': '''ls 
        free
        for i in 1 2 3; do 
        echo $i
        done''',
        'db': db,
        })
    print(result)

if __name__ == '__main__':
    asyncio.run(run_helper())
