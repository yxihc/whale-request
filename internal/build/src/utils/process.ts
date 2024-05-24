// 执行脚本封装
//导入子进程
import { spawn } from 'child_process'
//log美化
import * as process from 'process'
import chalk from 'chalk'
import consola from 'consola'
//在子进程运行脚本
export const run = async (command: string, cwd: string) =>
  // 异步执行命令
  new Promise<void>((resolve, reject) => {
    // 识别命令字符
    const [cmd, ...args] = command.split(' ')
    // 打印需要执行的命令
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
    const app = spawn(cmd, args, {
      cwd, //执行命令的路径
      stdio: 'inherit', //将子进程贡献给主进程，直接会在命令行输出
      shell: process.platform === 'win32', //windows的话使用shell
    })
    // 杀掉进程
    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)
      if (code === 0) {
        //命令执行成功
        consola.info('执行成功')
        resolve()
      } else {
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
      }
    })
    process.on('exit', onProcessExit)
  })
