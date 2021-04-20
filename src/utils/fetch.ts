import axios from 'axios'
import fs from 'fs'
import os from 'os'
import { join } from 'path'
import logger, { loggerPrice } from './logger'
import spinner from './spinner'

const AUTH_PATH = join(os.homedir(), '.coin', 'auth.json');
const BASE_REQUEST_URL = 'https://pro-api.coinmarketcap.com'

type AuthProps = {
  token?: string
  manual?: {
    [p: string]: Array<string>
  }
  effects?: Array<string>
}

/**
 * 获取认证信息
 * @returns
 */
export function getAuth() {
  let auth = {} as AuthProps
  try {
    auth = JSON.parse(fs.readFileSync(AUTH_PATH, 'utf-8')) || {};
  } finally {
    return auth;
  }
}

/**
 * 更新认证信息
 *
 * @param {Object} newAuth
 */
 export function setAuth(newAuth = {}) {
  const auth = getAuth();
  fs.writeFileSync(AUTH_PATH, JSON.stringify({ ...auth, ...newAuth }, null, '  '));
}

const fetch = axios
  .create({
    baseURL: BASE_REQUEST_URL,
    timeout: 20 * 1000,
    withCredentials: true,
    transformRequest: [
      function(data, headers) {
        const { token = '' } = getAuth();
        headers['X-CMC_PRO_API_KEY'] = token
        return JSON.stringify(data);
      },
    ],
    headers: {
      'Content-Type': 'application/json',
    },
  })

fetch.interceptors.response.use(
    (response) => {
      const isObj = typeof response.data === 'object'
      if (isObj) {
        return response.data
      }
      process.exit(1)
    },
    (error) => {
      const { response = {} } = error
      logger({
        symbol: 'error',
        color: 'red',
        title: response.status === 401 ? '认证失败' : '查询失败'
      })
      process.exit(1)
    }
  )

export default fetch

export async function fetchCurrency({ symbol, convert }) {
  spinner.start('正在查询货币信息')
  const { data = {} } = await fetch({
    url: 'v1/cryptocurrency/quotes/latest',
    method: 'get',
    params: { symbol, convert }
  })
  spinner.stop(true)
  return data
}
