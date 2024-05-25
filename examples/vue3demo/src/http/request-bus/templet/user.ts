// import { whaleRequest } from '@whale-requset/request-lib'

import { whaleRequest } from 'whale-request'

export function regUser(url: string) {
  return whaleRequest.get({
    url,
    useCache: true,
    cache: {
      key() {
        return 'user'
      },
      isPersist: false,
    },
    retry: 3,
    retryInterval: 1000,
  })
}
