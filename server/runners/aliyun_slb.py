#!/usr/bin/env python
#coding=utf-8
import asyncio, ast

def switch_to(s):
    from aliyunsdkcore.client import AcsClient
    from aliyunsdkcore.acs_exception.exceptions import ClientException
    from aliyunsdkcore.acs_exception.exceptions import ServerException
    from aliyunsdkslb.request.v20140515.SetBackendServersRequest import SetBackendServersRequest

    aliyun_config = ast.literal_eval(open('./resources/aliyun_keys').read().strip())
    
    client = AcsClient(*aliyun_config)

    request = SetBackendServersRequest()
    request.set_accept_format('json')

    servers = { 
    'mjmh115' : "[{ \"ServerId\": \"i-wz9h9dw9lnjejjdnhtad\", \"Weight\": \"0\"}, { \"ServerId\": \"i-wz9ece4mm10irs0ynhyd\", \"Weight\": \"100\"}]",
    'mjmh114' : "[{ \"ServerId\": \"i-wz9h9dw9lnjejjdnhtad\", \"Weight\": \"100\"}, { \"ServerId\": \"i-wz9ece4mm10irs0ynhyd\", \"Weight\": \"0\"}]",
    'all' : "[{ \"ServerId\": \"i-wz9h9dw9lnjejjdnhtad\", \"Weight\": \"100\"}, { \"ServerId\": \"i-wz9ece4mm10irs0ynhyd\", \"Weight\": \"100\"}]",
    }
    request.set_LoadBalancerId("lb-wz9rj3u81nto0zxmd4iba")
    request.set_BackendServers(servers.get(s))
    try:
        response = client.do_action_with_exception(request)
    except Exception as e:
        return 1, str(e)
    # python2:  print(response) 
    res = str(response, encoding='utf-8')
    return 0, res

async def main(env, custom_args={}):
    args = {'backend': 'backend'}
    args.update(custom_args)
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
            None, switch_to, env.get(args.get('backend')))
    return result


async def run_helper():
    result = await main({
        'backend': 'all',
        })
    print(result)

if __name__ == '__main__':
    asyncio.run(run_helper())
