import inquirer from 'inquirer';
import { setAuth } from '../utils/fetch'
import logger from '../utils/logger'

module.exports = async function token(ctx) {
  const { token } = await inquirer.prompt([
    {
      type: 'input',
      name: 'token', // 不知道为啥登录系统硬要把userNo叫成userNo
      message: '请输入Token',
      validate: (value) => {
        if (!value) {
          return '请输入Token！'
        }
        return true
      }
    }
  ])

  setAuth({ token })
  logger({ symbol: 'success', color: 'green', title: '设置成功！' })
}
