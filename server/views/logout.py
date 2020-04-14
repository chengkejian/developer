from sanic.response import json, text


async def ls(app, request):
    request['session']['user'] =  {}
    return text('OK')
