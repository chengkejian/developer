# 执行器
用于执行一组函数，这些函数的接收上下文中的变量作为参数，输出结果在结束前会保存至 result 这个临时变量中，可通过 result_mapper 存储至变量中。

## 已实现的执行器
### ssh_runner
用于远程执行命令

入参:

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
cmd | str | 执行的命令 | "ls -l"
host_id | str | 目标主机，来源为 servers | 

出参：

返回的数据为元组

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
0 | int | 命令退出的状态码，0 为成功，其它值为失败 | 
1 | str | 标准错误 | 
2 | str | 标准输出 | 

### command_runner
执行本地命令

入参:

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
cmd | str | 执行的命令 | "ls -l"

出参：

返回的数据为元组

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
0 | int | 命令退出的状态码，0 为成功，其它值为失败 | 
1 | str | 标准错误 | 
2 | str | 标准输出 | 

### mysql_runner
执行 MySQL 语句

入参:

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
data | dict | 包含 | {'content':{'sql': 'SELECT 1;', 'db': '1'}}

出参：

返回的数据为元组

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
0 | int | 0 为成功，1 为失败 | 
1 | str | 用户友好的输出 | 
2 | list | 每条SQL语句的执行信息，内容为字典，见下面 | 

成功时

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
sql | str | 执行的语句，单条 | 'SELECT 1;'
affect | int | 影响的行数 | 0
return | list | 结果，内容为`dict` |  [{'1': 1}]

失败时

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
sql | str | 执行的语句，单条 | 'SELECT 1;'
exception | str | 错误 | `Exception`的消息

### dingtalk

入参:

参数 | 类型 | 说明 | 示例 
-----|------|------|-----
dingtalk_token | str | 群机器人的 token |
dingtalk_message | str | 消息内容 |

出参：

无

## 待实现的执行器
### dummy
什么都不做，用于设置变量

### http
http/https 请求