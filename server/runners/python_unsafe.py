
async def main(content, variables, context):
    print(__name__)
    print('content', content)
    print('variables', variables)
    print('context', context)
    _variables = variables.copy()
    _variables.update({
        'str': str,
        'all': all,
        'variables': variables,
        })
    exec(content)
