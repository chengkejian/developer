import datetime
import json

async def ls(app, request):
    uuid = request.get('uuid')
    request.args.pop('create_at') if request.args.get('create_at') == '""' else []
    if request.args.get('create_at') != None:
        startDate,endDate = list(json.loads(request.args.get('create_at')).values())
        if startDate:
            request.args['create_at-gt'] = [startDate]
        if endDate:
            endDate_nextday = datetime.datetime.strptime(endDate, "%Y-%m-%d") + datetime.timedelta(days=+1)
            endDate = endDate_nextday.strftime('%Y-%m-%d')
            request.args['create_at-lt'] = [endDate]
        request.args.pop('create_at')
    pass