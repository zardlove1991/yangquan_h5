import axios from 'axios';
const instance = axios.create({
    baseURL:'http://mapi.yqrtv.com',
    // timeout: 3000,
    credentials: false,
    params: {
      appkey:'94bb4da0689605cbd97e6e7b77099640',
      appid: 'm2on4nlr0fuqucry69'
    }
})
const createAPI = (url, method = 'get', params = {}) => {
    return instance({
      url: url,
      withCredentials: false,
      method,
      params
    })
}
// http request 拦截器
instance.interceptors.request.use(
    config => {
      return config
    },
    err => {
      return Promise.reject(err)
  })
  // http response 拦截器
  // instance_bbs.interceptors.response.use(
  //   response => {
  //     //拦截响应，做统一处理 
  //     if (response.data.ErrorCode) {
  //       Toast(response.data.ErrorText)
  //     }
  //     return response
  //   },
  //   //接口错误状态处理，也就是说无响应时的处理
  //   error => {
  //     return Promise.reject(error.response.status) // 返回接口返回的错误信息
  //   })
  const HouseAPI = {
    getSwipeList: (params) => createAPI('/api/open/yq/column_content.php?column_id=206', 'get', params),
    getMiddleList:(params) => createAPI('/api/open/yq/column_content.php?column_id=207', 'get', params),
    getBottomList:(params) => createAPI('/api/open/yq/column_content.php?column_id=208', 'get', params),
    getDetail:(params) => createAPI('/api/open/yq/h5-item.php', 'get', params),
    getType: (params) => createAPI('/api/open/yq/h5-house-layout.php','get', params)
  }
  const CarAPI = {
    getSwipeList: (params) => createAPI('/api/open/yq/column_content.php?column_id=209', 'get', params),
    getMiddleList:(params) => createAPI('/api/open/yq/column_content.php?column_id=210', 'get', params),
    getBottomList:(params) => createAPI('/api/open/yq/column_content.php?column_id=211', 'get', params),
    getDetail:(params) => createAPI('/api/open/yq/h5-item.php', 'get', params),
    getType: (params) => createAPI('/api/open/yq/h5-car-model.php','get', params)
  }
  export default import.meta.env.MODE == 'house' ?  HouseAPI :  CarAPI

  