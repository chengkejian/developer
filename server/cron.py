import asyncio
from crontab import CronTab
import datetime
from functools import partial
from funcs import runner
from trump.query import create_item, modify_item

async def _runner(task, env):
    fullname = f"{task.get('id')}/{task.get('name')}"
    add_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"{add_date}[ADD][CRON] {fullname}")

    c = CronTab(task.get('cron'))
    myenv = env.copy()

    while True:
        await asyncio.sleep(c.next(default_utc=False))
        run_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"{run_date}[RUN] {fullname}")
        try:
            result = await runner.run(task.get('runner_id'), myenv)
        except Exception as e:
            print(f"{run_date}[ERR] {fullname} {e}")
            result = {"result":e,"status":1}
        await create_item(myenv.get('db'), "cron_log", {"name": task.get("name"), "cron_id": task.get("id"),
                                                  "create_at": run_date,
                                                  "status": "fail" if result["status"] else "success",
                                                  "resutl": str(result["result"])})
        next_run = datetime.datetime.now() + datetime.timedelta(seconds=c.next(default_utc=False))
        await modify_item(myenv.get('db'), "cron", task.get("id"),
                    {"next_run": next_run.strftime('%Y-%m-%d %H:%M:%S'),
                     "last_status": "fail" if result["status"] else "success"})

        print(f"{run_date}[FIN] {fullname}")

async def run_helper():
    from trump.config import DB_CONFIG
    from trump.query import create_item, get_items, create_pools
    loop = asyncio.get_event_loop()
    db = await create_pools(loop, **DB_CONFIG)
    crons = await get_items(db, 'cron', {'status': 'enable'})
    tasks = []
    for cron in crons:
        #executer()
        tasks.append(asyncio.create_task(_runner(cron, env={'db': db})))

    for task in tasks:
        await task


if __name__ == '__main__':
    print(asyncio.run(run_helper()))
