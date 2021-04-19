import chalk from 'chalk';
import logSymbols from 'log-symbols';

type LoggerProps = {
  color?: string,
  title: string,
  symbol?: 'success'|'warning'|'info'|'error',
  prefix?: string
  suffix?: string
}

export default function logger({ color, title, symbol, prefix, suffix }: LoggerProps) {
  let string = title

  if (color) {
    string = chalk[color](title)
  }

  if (symbol) {
    string = `${logSymbols[symbol]} ${string}`
  }

  if (prefix) {
    string = `${prefix}${string}`
  }

  if (suffix) {
    string = `${string}${suffix}`
  }

  console.log(string);
};


const LIST_OPTIONS = [
  { key: 'price', title: '最新价格' },
  { key: 'volume_24h', title: '24小时成交量' },
  { key: 'percent_change_1h', title: '1小时上涨百分比' },
  { key: 'percent_change_24h', title: '24小时上涨百分比' },
  { key: 'percent_change_7d', title: '1周上涨百分比' },
  { key: 'percent_change_30d', title: '1个月上涨百分比' },
  { key: 'percent_change_60d', title: '2个月上涨百分比' },
  { key: 'percent_change_90d', title: '1季度上涨百分比' }
]

export function loggerPrice({ symbol, name, convertInfo }) {
  logger({
    title: `${symbol}(${name})`,
    symbol: 'success',
    color: 'green'
  })

  LIST_OPTIONS.forEach(({ key, title }) => {
    const number = Number(convertInfo[key])

    logger({
      symbol: 'success',
      title: `${title} ${chalk[number > 0 ? 'green' : 'red'](convertInfo[key] || '')}`,
      prefix: ' '
    })
  })
}
