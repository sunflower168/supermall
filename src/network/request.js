import axios from "axios";

export  function request(config) {
  //创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })

  //发送真正的网络请求
  //2.1axios的拦截器
  // instance.interceptors.request.use(config => {
  //   console.log(config);
  // },err => {
  //   // console.log(err);
  // })

  //2.2 响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  },err => {
    console.log(err)
  })
  return instance(config)

}

