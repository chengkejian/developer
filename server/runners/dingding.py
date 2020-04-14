#!/usr/bin/python
# -*- coding: utf-8 -*-
import aiohttp
from trump.query import get_items

async def msg_format(content, variables, _context):
    try:
        event_user = await get_items(_context.get('db'), 'users',{'id':_context.get('data')['uid']})
        event_user = event_user[0]
    except Exception as e:
        pass
    content = content
    variables = variables
    _context = _context
    dingding_api = "https://oapi.dingtalk.com/robot/send?access_token=" + content.get("ding_token")
    text = '### [爱彼利Developer系统:](http://developers.aibilitech.com) \n'
    text = text + "  #### " + content.get("title") + " \n"
    global text_value
    for key in content.get("message"):
        try:
            exec("global text_value; text_value= %s" % content.get("message")[key])
        except Exception as e:
            text_value = content.get("message")[key]
        print(text_value)
        text = text + " > - " + key + "： " + str(text_value) + " \n"
    return dingding_api,text

async def send_alert(dingding_api,text):
    json_text = {
        "msgtype": "markdown",
        "markdown": {
            "title": "爱彼利Developer系统",
            "text": text
        },
        "at": {
            "isAtAll": True
        }
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(dingding_api, json=json_text) as response:
            html = await response.text()
async def main (content, variables, _context):
    dingding_api,post_data = await msg_format(eval(content),variables,_context)
    await send_alert(dingding_api,post_data)
    return 0,'钉钉消息推送成功'
