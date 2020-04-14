import paramiko
import asyncio
from trump.query import create_item, get_item

def _main(content, target, variables, context):
    print(__name__)
    print('content', content)
    print('target', target)
    print('variables', variables)
    print('context', context)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=target.get('ssh_ip'), username=target.get('ssh_user'), port=target.get('ssh_port'), key_filename="./resources/id_rsa", timeout=10)
    stdin, stdout, stderr = client.exec_command(content.format(**variables), timeout=10)
    #stdin, stdout, stderr = client.exec_command(env.get(args.get('cmd')), timeout=10)
    stdin.close()
    exit_status = stdout.channel.recv_exit_status()
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
    client.close()
    print ("Closed")
    if exit_status == 0:
        return exit_status, result
    else:return 1, errs

async def main(content, variables, context):
    target = await get_item(context.get('db'), 'servers', variables.get('host'))
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
            None, _main, content, target, variables, context)
    return result
