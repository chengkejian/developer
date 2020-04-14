import asyncio
import time
from crontab import CronTab
from datetime import datetime
from functools import partial
from funcs import executer
from trump.query import create_item, get_items, create_pools, modify_item


async def _runner(task, env):
    fullname = f"{task.get('id')}/{task.get('name')}"
    base = f"[{datetime.now()}]"
    print(f"{base}[ADD][TMR] {fullname} {task.get('run_at')}")
    run_at = datetime.strptime(task.get('run_at'), '%Y-%m-%d %H:%M:%S')
    myenv = env.copy()
    delay = run_at.timestamp() - time.time()
    await asyncio.sleep( delay if delay > 1 else 1 )
    print(f"{base}[RUN] {fullname}")
    try:
        await executer.run(None, {}, task.get('executer_id'), extra=myenv)
    except Exception as e:
        print(f"{base}[ERR] {fullname} {e}\n{traceback.format_exc()}")
    print(f"{base}[FIN] {fullname}")
    await modify_item(env['db'], 'timer', task.get('id'), {'status': 'done'})


async def run_helper():
    from trump.config import DB_CONFIG
    loop = asyncio.get_event_loop()
    db = await create_pools(loop, **DB_CONFIG)
    timmers = await get_items(db, 'timer', {'status': 'enable'})
    tasks = []
    for timmer in timmers:
        #executer()
        tasks.append(asyncio.create_task(_runner(timmer, env={'db': db})))

    for task in tasks:
        await task
    # sleep for supervisord exit normal
    await asyncio.sleep(2)


if __name__ == '__main__':
    print(asyncio.run(run_helper()))
