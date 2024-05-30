import { rename } from 'fs/promises'
import path from 'path'
import { parallel, series } from 'gulp'
import consola from 'consola'
import inquirer from 'inquirer'
import { Client } from 'ssh2'
import chalk from 'chalk'
import { is } from '@babel/types'
import { buildRoot, projRoot, run } from './src'
import type { TaskFunction } from 'gulp'

// rename(path.resolve(projRoot, 'dist'), path.join(webProjectRoot, 'lishui2/web/dist')),

function withTaskName<T extends TaskFunction>(name: string, fn: T) {
  return Object.assign(fn, { displayName: name })
}

export default series(connect)

function connect(done: any) {
  const host = ''
  const sshConfig = {
    host,
    port: 22, // 默认 SSH 端口
    username: 'root',
    password: '', // 或者使用私钥代替
  }
  const client = new Client()

  client
    .on('ready', async () => {
      consola.info(chalk.green(`服务器(${host})==>连接成功`))
      // client.exec('cd ..', (err, stream) => {
      //   callback(err, stream, false)
      // })
      // client.exec('cd /server/testweb', (err, stream) => {
      //   callback(err, stream, false)
      // })
      // client.exec('ls', (err, stream) => {
      //   callback(err, stream, false)
      // })
      // cd ..; cd /server/testweb
      // const result1 = await execCommand('cd .. ')
      // consola.info(chalk.green(`服务器(${host})==>cd .. 执行成功：${result1}`))
      // const result2 = await execCommand('cd server')
      // consola.info(
      //   chalk.green(`服务器(${host})==>cd /server/testweb 执行成功：${result2}`)
      // )
      const result3 = await execCommand('ls')
      consola.info(
        chalk.green(`服务器(${host})==>git pull 执行成功：${result3}`)
      )
      client.end()
      done()
    })
    .connect(sshConfig)

  // const callback = (err: any, stream: any, isClose: boolean) => {
  //   stream
  //     .on('close', (code: string, signal: string) => {
  //       consola.info(chalk.green(`服务器(${host})==>命令执行成功`))
  //       if (isClose) client.end()
  //     })
  //     .on('data', (data: any) => {
  //       consola.info(chalk.green(`服务器(${host})==>响应：${data}`))
  //     })
  //     .stderr.on('data', (data: any) => {
  //       consola.info(chalk.green(`服务器(${host})==>错误：${data}`))
  //     })
  // }

  // 用于执行命令的函数
  const execCommand = (command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      client.exec(command, (err, stream) => {
        if (err) return reject(err)
        let data = ''
        stream
          .on('close', (code, signal) => {
            if (code !== 0) {
              reject(
                new Error(`Command failed with code ${code}, signal ${signal}`)
              )
            } else {
              resolve(data)
            }
          })
          .on('data', (chunk) => {
            data += chunk
          })
          .stderr.on('data', (chunk) => {
            console.error(`STDERR: ${chunk}`)
          })
      })
    })
  }
}

function inputTest(done: any) {
  const questions = [
    {
      type: 'input',
      name: 'version',
      message: '请输入发布版本号:',
    },
  ]
  inquirer.prompt(questions).then((answers: any) => {
    consola.success(`你输入了: ${answers.version}`)
    done()
  })
}

function chooseTest(done: any) {
  const questions = [
    {
      type: 'list',
      name: 'choice',
      message: '请选择一个选项:',
      choices: ['选项1', '选项2', '选项3'],
    },
  ]
  inquirer.prompt(questions).then((answers: any) => {
    console.log(`你选择了: ${answers.choice}`)
    done()
  })
}
