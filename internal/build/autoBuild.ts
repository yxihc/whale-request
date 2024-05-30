import { copyFile, mkdir, rename } from 'fs/promises'
import path, { resolve } from 'path'
import { parallel, series } from 'gulp'
import consola from 'consola'
import { buildRoot, projRoot, wlOutput, wlPackage } from './src/path'
import { run, runTask, withTaskName } from './src'

function copyFiles() {
  return Promise.all([
    copyFile(wlPackage, path.join(wlOutput, 'package.json')),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(wlOutput, 'README.md')
    ),
    // copyFile(
    //   path.resolve(projRoot, 'global.d.ts'),
    //   path.resolve(wlOutput, 'global.d.ts')
    // ),
  ])
}

function moveFile() {
  return Promise.all([
    rename(path.resolve(buildRoot, 'dist'), path.join(wlOutput, 'dist')),
    rename(path.resolve(buildRoot, 'es'), path.join(wlOutput, 'es')),
    rename(path.resolve(buildRoot, 'lib'), path.join(wlOutput, 'lib')),
  ])

  // rename(path.resolve(buildRoot, 'dist'), path.join(wlOutput, 'dist'))
  // rename(path.resolve(buildRoot, 'es'), path.join(wlOutput, 'es'))
  // rename(path.resolve(buildRoot, 'lib'), path.join(wlOutput, 'lib'))
}

export default series(
  // @ts-ignore
  withTaskName('clean', () => run('pnpm run clean', projRoot)), //创建输出文件
  withTaskName('createOutput', () => mkdir(wlOutput, { recursive: true })),
  withTaskName('build:code', () => run('pnpm run build:code', buildRoot)),
  withTaskName('build:types', () => run('pnpm run build:types', buildRoot)),
  // moveFile
  // copyFiles
  parallel(copyFiles, moveFile),
  () => {
    consola.info('打包任务完成')
    return Promise.resolve('')
  }
)

// @ts-ignore
export * from './src'
