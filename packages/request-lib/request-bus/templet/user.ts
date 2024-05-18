import {createDebounceRequestor} from "../../request-core";

export function regUser(url:string) {
  const req = createDebounceRequestor()
  return req.get(url, {})
}
