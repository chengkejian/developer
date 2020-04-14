import json

async def main(content, variables, context):
    variables.update(json.loads(content))
    return 0, '设置变量：%s' % (content)