import { useMemberStore } from '@/stores/modules/member'

// 基础地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: any) {
    // 1.非http开头的地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2.请求超时的时间 毫秒
    options.timeout = 10000
    // 3.添加小程序端请求头标识
    options.header = {
      // 保留传入的请求头配置
      ...options.header,
      'source-client': 'miniapp',
    }
    // 4.添加token请求头标识
    const memberStore = useMemberStore()
    // 因为是清楚token是undefined，所以加？
    const token = memberStore.profile?.token
    if (token) {
      // 添加到请求头中
      options.header.Authorization = token
    }
    console.log(options)
  },
}
/*
// 添加拦截器，第一个参数是需要拦截的api名称，第二个参数是配置项
invoke	Function	否		拦截前触发
returnValue	Function	否		方法调用后触发，处理返回值
success	Function	否		成功回调拦截
fail	Function	否		失败回调拦截
complete	Function	否		完成回调拦截
*/
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)
