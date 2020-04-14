import asyncio
import shlex, subprocess


def _main(content, variables, context):
    print(__name__)
    print('content', content)
    print('variables', variables)
    print('context', context)
    result = subprocess.run(content.format(**variables), capture_output=True, shell=True, timeout=60)
    return result.returncode, result.stderr.decode(), result.stdout.decode()

async def main(content, variables, context):
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
            None, _main, content, variables, context)
    return result


async def run_helper():
    result = await main({
        'cmd': 'env GIT_SSH_COMMAND="ssh -oPasswordAuthentication=no -i /code/ssh/id_rsa" git ls-remote -q git@git.yaoyingli.cn:aibili/trump.git',
        })
    print(result)

if __name__ == '__main__':
    asyncio.run(run_helper())
