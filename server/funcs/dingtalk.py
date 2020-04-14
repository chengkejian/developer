import aiohttp
import asyncio


async def post(url, data):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            html = await response.text()
            print(html)

url = 'https://oapi.dingtalk.com/robot/send?access_token='

message = {
    "msgtype": "text",
    "text": {
        "content": u"测试消息",
    },
    "isAtAll": True,
}

async def main(env, custom_args={'token': 'dingtalk_token', 'message': 'dingtalk_message'}):
    args = {'token': 'dingtalk_token', 'message': 'dingtalk_message'}
    args.update(custom_args)
    return await post(url + env.get(args.get('token')), {
        "msgtype": "text",
        "text": {
            "content": env.get(args.get('message')),
            },
        "isAtAll": True,
        })

if __name__ == '__main__':
    asyncio.run(main({
        'dingtalk_token': '584849eff953241e8c5ed06d594cee658c01371641184c5d04c516e4aa77a992',
        'dingtalk_message': message,
        }))
