export interface RequestOptions {
}

// 定义接口，不负责实现
export interface Requestor {
  get(url: string, options: RequestOptions): Promise<Response>;

  post(url: string, data: any, options: RequestOptions): Promise<Response>;
}



// 本模块的大部分功能都需要使用到requestor
let req: Requestor;

export function inject(requestor: Requestor) {
  req = requestor;
}


export function useRequestor(): Requestor {
  return req;
}

// 创建一个可以重试的请求
export function createDebounceRequestor(debounceInterval = 1000) {
  const req = useRequestor();
  // 进一步配置req
  interceptPromise(req.get)
  return req;
}


function interceptPromise(promise) {
  return new Promise((resolve, reject) => {
    promise.then(value => {
      // 在这里可以进行拦截处理
      console.log('Before promise resolves.');
      resolve(value);
    }).catch(error => {
      // 在这里可以进行拦截处理
      console.log('Before promise rejects.');
      reject(error);
    });
  });
}

// 对请求进行配置
// 注册请求发送前的事件
//   req.on('beforeRequest', async (config) => {
//     const key = options.key(config); // 获得缓存键
//     const hasKey = await store.has(key); // 是否存在缓存
//     if (hasKey && options.isValid(key, config)) {  // 存在缓存并且缓存有效
//       // 返回缓存结果
//     }
//   })
//   req.on('ceshi', (config, resp) => {
//     //获取消息
//   })


