import asyncio
import shlex, subprocess


def run_cmd(cmd):
    result = subprocess.run(shlex.split(cmd), capture_output=True)
    return result.returncode, result.stderr.decode(), result.stdout.decode()
    #return [x.strip().split() for x in result.stdout.decode().strip().splitlines()]

async def main(env, custom_args={}):
    args = {'cmd': 'cmd'}
    args.update(custom_args)
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
            None, run_cmd, env.get(args.get('cmd')))
    return result


async def run_helper():
    result = await main({
        'cmd': 'env GIT_SSH_COMMAND="ssh -oPasswordAuthentication=no -i /code/ssh/id_rsa" git ls-remote -q git@git.yaoyingli.cn:aibili/trump.git',
        })
    print(result)

if __name__ == '__main__':
    asyncio.run(run_helper())
