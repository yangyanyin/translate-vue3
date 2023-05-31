/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';
// env前端设置请求域名
axios.defaults.baseURL = '/'

axios.defaults.withCredentials = true

// 请求超时时间
axios.defaults.timeout = 10001

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return error;
  }
);

// 响应拦截器
axios.interceptors.response.use(response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 402:
          break;
        // 404请求不存在
        case 404:
          break;
        // 其他错误，直接抛出错误提示
        default:
          // console.log(error.response.data.message);
      }
      return Promise.reject(error.response);
    }
  }
);


/**
* q请求方法
* @param {String} options.url [请求的url地址]
* @param {Object} options.params [请求时携带的参数]
*/
export default function $axios (options:any) {
  let apiUrl = options.url
  let params = options.params

  if (options.method === 'post') {
    return new Promise((resolve, reject) => {
      axios.post(apiUrl, QS.stringify(params)).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err.data);
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      axios.get(apiUrl,{params: params}).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data);
      })
    })
  }
}