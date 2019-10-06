from time import time, sleep

from slackclient import SlackClient


class RateLimitedSlackClient(SlackClient):
    '''Slack client with rate limit'''

    def __init__(self, token, proxies=None, ratelimit=1.0):
        super(RateLimitedSlackClient,self).__init__(token, proxies)
        self.ratelimit = ratelimit
        self.last_invoked = time() - ratelimit

    def api_call(self, method, timeout=None, **kwargs):
        while True:
            now = time()
            if (now - self.last_invoked) >= self.ratelimit:
                result = super(RateLimitedSlackClient,self).api_call(method, timeout=timeout, **kwargs)
                self.last_invoked = time()
                return result
            else:
                sleep(self.ratelimit - (now - self.last_invoked))

    def rtm_send_message(self, channel, message, thread=None, reply_broadcast=None):
        while True:
            now = time()
            if (now - self.last_invoked) >= self.ratelimit:
                result = super(RateLimitedSlackClient,self).rtm_send_message(channel, message, thread=None, reply_broadcast=None)
                self.last_invoked = time()
                return result
            else:
                sleep(self.ratelimit - (now - self.last_invoked))




