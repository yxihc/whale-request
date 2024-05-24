import path, { resolve } from 'path'
// 列出所有的文件路径
export const projRoot = resolve(__dirname, '..', '..', '..')
export const buildOutput = resolve(projRoot, 'dist')
export const pkgRoot = resolve(projRoot, 'packages')
export const wlRoot = resolve(pkgRoot, 'whale-request')
export const wlPackage = resolve(wlRoot, 'package.json')
export const wlOutput = resolve(buildOutput, 'whale-request')
export const buildRoot = resolve(projRoot, 'internal', 'build')
