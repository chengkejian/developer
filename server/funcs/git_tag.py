#!/usr/bin/env python
#coding=utf-8
import git
import os

def git_tags(url, reverse=True):
    remote_refs = []
    g = git.cmd.Git()
    if url is not None:
        #获取tag并排序
        for ref in g.ls_remote("-t", url, env={"GIT_SSH_COMMAND": 'ssh -i %s/resources/id_rsa' %(os.getcwd())}).split('\n'):
            hash_ref_list = ref.split('\t')
            temp = hash_ref_list[1].split("/")[2]
            remote_refs.append(temp)
        try:
            remote_refs.sort(key=lambda x: tuple(int(v) for v in x[x.find('v'):].replace('v', '').replace('-', '').split('.')), reverse=reverse)
        except:
            print(url + '的tag排序出错，请检查！')
            remote_refs.sort(reverse=reverse)
        #获取branch
        for ref in g.ls_remote("-h", url, env={"GIT_SSH_COMMAND": 'ssh -i %s/resources/id_rsa' %(os.getcwd())}).split('\n'):
            hash_ref_list = ref.split('\t')
            temp = hash_ref_list[1].split("/")[2]
            remote_refs.insert(0,temp)
        return remote_refs
    return []
