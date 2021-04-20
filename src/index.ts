import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import Context from './Context'
import logger from './utils/logger'

// 创建根文件夹
const homeDir = path.join(os.homedir(), '.coin');
if (!fs.existsSync(homeDir)) {
  mkdirp.sync(homeDir);
}

// 读取版本信息
program.version(require('../package.json').version);

program
  .command('list')
  .description('查看货币列表（分页）')
  .option('-s, --start <start>', '页码')
  .option('-l, --limit <limit>', '每页条数')
  .option('-c, --convert <type>', '兑换币种')
  .action((options) => {
      new Context({
        command: 'list',
        homeDir,
        args: options
      }).start()
    })

program
  .command('currency')
  .description('查看货币信息')
  .option('-c, --convert <type>', '兑换币种')
  .action((options) => {
    const symbol = program.args[1]
    if (symbol.startsWith('-c') || symbol.startsWith('--convert')) {
      return logger({
        symbol: 'error',
        color: 'red',
        title: '请输入想要查询的货币'
      })
    }
    new Context({
      command: 'currency',
      homeDir,
      args: {
        symbol,
        ...options
      }
    }).start()
  })

program
  .command('manual')
  .description('维护手动添加的货币')
  .option('-a, --add', '添加币种')
  .option('-r, --remove', '删除币种')
  .option('-l, --list', '查看添加的币种信息')
  .action((options) => {
    new Context({
      command: 'manual',
      homeDir,
      args: options
    }).start()
  })


program
  .command('token')
  .description('设置Token')
  .action(() => {
    new Context({
      command: 'token',
      homeDir,
    }).start()
  })

program.parse(process.argv);
