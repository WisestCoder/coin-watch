import axios from 'axios'
import fs from 'fs'
import os from 'os'
import { join } from 'path'
import logger from './logger'

const AUTH_PATH = join(os.homedir(), '.coin', 'auth.json');
const BASE_REQUEST_URL = 'https://pro-api.coinmarketcap.com'

/**
 * 获取认证信息
 * @returns
 */
export function getAuth() {
  let auth = {} as { token?: string }
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
      const { response } = error
      if (response.status === 401) {
        logger({
          symbol: 'error',
          color: 'red',
          title: '认证失败'
        })
      }
      process.exit(1)
    }
  )

export default fetch
