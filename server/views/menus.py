from trump.decorators import no_pager, anonymous, table_headers
from trump.query import get_items, get_item
from trump.utils import fail


@no_pager
async def ls(app, request):
    if request.get("user"):
        user = request.get('user')
        role_code = user.get("role_code")
        if role_code:
            role_code_str = [str(i) for i in role_code if i.strip() != ""]
            role_code_str = ",".join(role_code_str)
            request.args["role_code-overlap"] = [role_code_str]
        else:
            return fail(return_msg="该用户没有分配角色")
        # request.args["role_code-overlap"] = ()

async def post_ls(app, request, data):
    data.extras['first_name'] = request.get("user")['name'][-1]
