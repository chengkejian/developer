import docker

class SshForwarder():
    def __init__(self,base_ip='192.168.1.30',base_port=2375):
        self.base_url =  base_ip
        self.base_port = base_port
        try:
            self.client = docker.DockerClient(base_url='tcp://%s:%s' %(self.base_url,self.base_port) , version='auto', timeout=5)
        except Exception as e:
            print(e)
        try:
            self.client.images.get('harbor.dev.aibilitech.com:65080/sshforwarder/ssh_forwarder:latest')
        except Exception as e:
            self.client.images.pull('harbor.dev.aibilitech.com:65080/sshforwarder/ssh_forwarder',tag='latest')
    async def create_forwarder(self,name='ssh_forwarder',transpond_ip='',transpond_port=22,
                         transpond_user='root',transpond_passwd='',transpond_key='',
                         remote_ip='127.0.0.1',remote_port=80,local_port=80):
        try:
            self.client.containers.run('harbor.dev.aibilitech.com:65080/sshforwarder/ssh_forwarder:latest',
                                       name=name,detach=True,environment={'transpond_ip':transpond_ip,
                                                                                                    'transpond_port':transpond_port,
                                                                                                    'transpond_user':transpond_user,
                                                                                                    'transpond_passwd':transpond_passwd,
                                                                                                    'transpond_key':transpond_key,
                                                                                                    'remote_ip':remote_ip,
                                                                                                    'remote_port':remote_port,
                                                                                                    'local_port':local_port
                                                                                                    },
                                                   ports={'%s/tcp' %(local_port):local_port})
        except Exception as e:
            print(e)
            return 0,'fail'
        container = self.client.containers.get(name)
        return [1,container.status] if container.status=='running' else [0,container.status]
    async def check_forwarder(self,name):
        try:
            container = self.client.containers.get(name)
        except Exception as e:
            print(e)
            return 'non-exit'
        return container.status
    async def restart_forwarder(self,name):
        try:
            container = self.client.containers.get(name)
            container.restart()
        except Exception as e:
            print(e)
            return 0
        return 1

    async def stop_forwarder(self,name):
        try:
            container = self.client.containers.get(name)
        except Exception as e:
            return 1
        container.stop()
        container.remove()
        return 1

