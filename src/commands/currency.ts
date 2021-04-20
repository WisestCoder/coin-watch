import { fetchCurrency } from '../utils/fetch'
import { loggerPrice } from '../utils/logger'

module.exports = async function currency(ctx) {
  const { convert = 'USD', symbol } = ctx.commandArgs || {}

  const data = await fetchCurrency({ symbol, convert })

  const symbolInfo = data[symbol.toUpperCase()] || {}
  const quote = symbolInfo.quote || {}

  Object.keys(quote).forEach((key) => {
    loggerPrice({
      symbol: symbolInfo.symbol,
      name: symbolInfo.name,
      convertInfo: quote[key] || {}
    })
  })
}
