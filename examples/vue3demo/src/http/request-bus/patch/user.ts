import { whaleRequest } from '@whale-requset/request-lib'

export function regUser(url: string) {
  // 使用了二次修改的函数
  return whaleRequest.get({
    url,
  })
}
