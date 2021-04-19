import fetch from '../utils/fetch'
import { loggerPrice } from '../utils/logger'
import spinner from '../utils/spinner'

module.exports = async function list(ctx) {
  const { start = 1, limit = 10, convert = 'USD' } = ctx.commandArgs || {}

  spinner.start('正在查询货币列表');
  const { data } = await fetch({
    url: 'v1/cryptocurrency/listings/latest',
    method: 'get',
    params: { start, limit, convert }
  })
  spinner.stop(true);



  data.forEach(({ symbol, name, quote }) => {
    const convertInfo = quote[convert] || {}
    loggerPrice({ symbol, name, convertInfo })
  })
}
