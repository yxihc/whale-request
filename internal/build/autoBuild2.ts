import { parallel, series } from 'gulp'
import consola from 'consola'
import { buildRoot, projRoot, run } from './src'
import type { TaskFunction } from 'gulp'

// 定义单个任务
function clean(cb: TaskFunction) {
  // 清理任务的逻辑，例如删除输出目录
  consola.success('Cleaning...')
  cb()
}

// const css = function (cb) {
//   // CSS 处理任务的逻辑，例如编译 Sass 或 Less
//   consola.info('Compiling CSS...');
//   cb();
// };
//
// const js = function (cb) {
//   // JavaScript 处理任务的逻辑，例如压缩 JS
//   consola.info('Minifying JS...');
//   cb();
// };

function withTaskName<T extends TaskFunction>(name: string, fn: T) {
  return Object.assign(fn, { displayName: name })
}

export default series(
  (fn) => {
    // return new Promise<any>((resolve, reject) => {
    //   setTimeout(() => {
    //     consola.success('222222...')
    //   }, 2000)
    //   resolve('ass')
    // })
    setTimeout(() => {
      consola.success('222222...')
    }, 2000)
    fn()
  },
  withTaskName('cc', (fn) => {
    consola.success('asdasd...')
    fn()
    // return run('npm run clean', '')
  }),
  withTaskName('cc', () => run('git pull', projRoot))
)
