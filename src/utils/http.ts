import { useMemberStore } from '@/stores/modules/member'

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
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)
