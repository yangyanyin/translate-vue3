import axios from './index'

// 登录
const getTranslateApi = (params:any) => axios({
  url: '/v1/translate',
  method: 'post',
  params: params
})

// export default {
//   getTranslateApi
// }
export {
  getTranslateApi
}