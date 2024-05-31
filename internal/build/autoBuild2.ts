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

export default series(readInputConnect)

function readInputConnect(done: any) {
  const questions = [
    {
      type: 'input',
      name: 'password',
      message: '请输入服务器密码:',
    },
  ]
  inquirer.prompt(questions).then((answers: any) => {
    const password = answers.password
    connect(done, password)
  })
}

function connect(done: any, password: string) {
  const host = ''
  const sshConfig = {
    host,
    port: 22, // 默认 SSH 端口
    username: 'root',
    password: password.trim(),
  }
  const client = new Client()
  client
    .on('ready', async () => {
      consola.info(chalk.green(`服务器(${host})==>连接成功`))
      client.exec(
        `
      cd ..
      cd /server/testweb 
      git pull
      `,
        (err, stream) => {
          stream
            .on('close', (code: string, signal: string) => {
              consola.info(chalk.green(`服务器(${host})==>命令执行成功`))
              client.end()
              consola.info(chalk.green(`服务器(${host})==>关闭连接`))
              done()
            })
            .on('data', (data: any) => {
              consola.info(chalk.green(`服务器(${host})==>响应：${data}`))
            })
            .stderr.on('data', (data: any) => {
              consola.info(chalk.green(`服务器(${host})==>错误：${data}`))
            })
        }
      )
    })
    .on('error', (err) => {
      console.error('Client :: error', err)
    })
    .on('end', () => {
      console.log('Client :: disconnected')
    })
    .connect(sshConfig)
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
