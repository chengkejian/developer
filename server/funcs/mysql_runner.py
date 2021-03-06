# pylint: disable-msg=E0611
from trump.utils import ok, fail
from sanic import response
import asyncio
import json
import subprocess
from trump.query import create_item, get_items, get_item, modify_item
import base64
import time
import pymysql.cursors
from datetime import datetime

import aiohttp
import asyncio

def sql_exec(sqls, db_config):
    success = True
    #if db == 'prd':
    #    db_config = {"host": "10.8.0.114", "user": "mjmh_prd", "password": "mjmh123!@#", "port": 33066, "db": "social_commerce", "use_unicode": True, "charset": "utf8mb4", "autocommit": True}

    connection = pymysql.connect(
            **db_config,
            cursorclass=pymysql.cursors.DictCursor) 
    cursor = connection.cursor() 
    results = []
    try:
        for sql in sqls:
            if sql:
                r = cursor.execute(sql)
                results.append({"sql": sql, "affect": r, "return": cursor.fetchall()})
    except Exception as e:
        results.append({"sql": sql, "exception": str(e) })
        success = False
    cursor.close()
    connection.close()
    return success, results


async def main(env, custom_args={}):
    args = {'db': 'db', 'data': 'data', 'uid': 'uid'}
    args.update(custom_args)
    db = env.get(args.get('db'))
    uid = env.get(args.get('uid'))
    content = env.get('data').get('content')
    sql = content['sql']
    db_id = int(content['db'])
    db_info = await get_item(db, 'mysql_databases', db_id)
    db_server = await get_item(db, 'mysql_servers', db_info.get('server_id'))
    db_config = {"host": db_server.get('host'), 
            "user": db_server.get('username'),
            "password": db_server.get('password'),
            "port": db_server.get('port'),
            "db": db_info.get('database'),
            "use_unicode": True, 
            "charset": "utf8mb4", 
            "autocommit": True}
    # try:
    #     status = json.loads(sql.get('status'))
    # except:
    #     status = {}
    # if status:
    #     return -2, "已执行"
    sqls = [x.strip() for x in sql.strip().split(';')]
    if sqls:
        loop = asyncio.get_running_loop()
        success, result = await loop.run_in_executor(
                    None, sql_exec, sqls, db_config)
        print(result)
        status = 0 if success else 1
        #await modify_item(db, 'sqls', sql.get('id'), {'status': json.dumps({"uid":uid, "result": str(result), "time": time.time(), "status": 0 if success else 1})})
        return status, result
    else:
        return -1, '命令不存在'

async def run_helper():
    from trump.config import DB_CONFIG
    from trump.query import create_item, get_items, create_pools
    loop = asyncio.get_event_loop()
    db = await create_pools(loop, **DB_CONFIG)
    result = await main({
        'db': db,
        'data': {'content': {'sql': 'select 1', 'db': 1}},
        'uid': 1,
        })
    print(result)

if __name__ == '__main__':
    asyncio.run(run_helper())
