### coin-watch

一款可以随意查看加密货币价格、浮动等等信息的命令行工具

### 安装

```bash
yarn global add @wisestcoder/coin-watch
# 或者
npm install -g @wisestcoder/coin-watch
```

### 命令行

#### token

设置token，所有的api调用都需要配置自己的token

token获取地址 [CoinMarketCap](https://coinmarketcap.com/api/)

```bash
coin token
```

#### list

查看货币列表，按照分页返回数据

```bash
coin list

Options:
  -l, --start <start>   页码
  -l, --limit <limit>   每页条数
  -c, --convert <type>  兑换币种
  -h, --help            display help for command
```

### currency

查看某一个货币信息

```bash
coin currency [coinType] # @example: coin currency btc

Options:
  -c, --convert <type>  兑换币种
```
