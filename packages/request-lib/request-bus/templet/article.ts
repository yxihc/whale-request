// import { createIdempotentRequest } from '../../request-core';

/**
 * 发布文章
//  */
// export const publishArticle = (() => {
//   const req = createIdempotentRequest();
//   return async (article: any) => {
//     return req.post('/api/article', article,null).then(resp=>resp.json())
//   }
// })();
//
//
// /**
//  * 获取文章
//  */
// export const getArticles = (() => {
//   return async (page: number, size: number) => {
//     const req = createIdempotentRequest();
//     return req.get('/api/article', {
//       params:{
//         page,
//         size
//       }
//     }).then(resp=>resp.json())
//   }
// })();
