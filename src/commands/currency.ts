import fetch from '../utils/fetch'
import { loggerPrice } from '../utils/logger'
import spinner from '../utils/spinner'



module.exports = async function currency(ctx) {
  const { convert = 'USD', symbol } = ctx.commandArgs || {}

  spinner.start('正在查询货币信息');
  const { data = {} } = await fetch({
    url: 'v1/cryptocurrency/quotes/latest',
    method: 'get',
    params: { symbol, convert }
  })
  spinner.stop(true);

  const symbolInfo = data[symbol.toUpperCase()] || {}
  const quote = symbolInfo.quote || {}
  const convertInfo = quote[convert] || {}

  loggerPrice({
    symbol: symbolInfo.symbol,
    name: symbolInfo.name,
    convertInfo
  })
}
