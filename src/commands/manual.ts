import inquirer from 'inquirer';
import fetch, { fetchCurrency, getAuth, setAuth } from '../utils/fetch'
import logger, { loggerPrice } from '../utils/logger'
import spinner from '../utils/spinner'
import { uniqueArr } from '../utils/const'

module.exports = async function currency(ctx) {
  const { add, remove } = ctx.commandArgs || {}
  const auth = getAuth()
  const { manual = {} } = auth

  // 添加货币
  if (add) {
    const { currency, convert } = await inquirer.prompt([
      {
        type: 'input',
        name: 'currency',
        message: '请输入货币（如：btc）',
        validate: (value) => {
          if (!value) {
            return '请输入货币！'
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'convert',
        message: '请输入兑换币种（如：USD）',
        default: 'USD',
        validate: (value) => {
          if (!value) {
            return '请输入兑换币种！'
          }
          return true
        }
      }
    ])

    if (!(manual[convert])) {
      manual[convert] = []
    }
    manual[convert] = uniqueArr([...manual[convert], currency])

    setAuth({ manual })
    return
  }

  // 检测是否已有货币信息
  if (!Object.keys(manual).length || Object.values(manual).every(item => !(item && item.length))) {
    logger({
      symbol: 'error',
      color: 'red',
      title: '未找到货币信息，请执行 coin manual --add 进行手动添加'
    })
    return
  }

  // 删除货币
  if (remove) {
    const currencyList = Object.keys(manual).reduce((prev, cur) => {
      const curList = (manual[cur] || []).map((item) => ({
        name: `${item}[${cur}]`,
        value: {
          currency: item,
          convert: cur
        }
      }))
      return [...prev, ...curList]
    }, [])

    const { deletes } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'deletes',
        message: '请选择您要删除的货币信息',
        choices: currencyList
      },
    ])

    deletes.forEach((item) => {
      const { currency, convert } = item
      manual[convert] = manual[convert].filter((x) => x !== currency)
    })

    setAuth({ manual })
    logger({
      symbol: 'success',
      color: 'green',
      title: '删除成功'
    })

    return
  }


  Object.keys(manual).forEach(async (convert) => {
    const currencyList = manual[convert] || []
    if (!currencyList.length) {
      return
    }

    const data = await fetchCurrency({
      symbol: currencyList.join(','),
      convert
    })

    Object.keys(data).forEach((key) => {
      const symbolInfo = data[key] || {}
      const quote = symbolInfo.quote || {}

      loggerPrice({
        symbol: symbolInfo.symbol,
        name: symbolInfo.name,
        convertInfo: quote[convert] || {}
      })
    })
  })
}
