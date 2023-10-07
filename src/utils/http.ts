import { useMemberStore } from '@/stores/modules/member'

// 基础地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
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

/*
请求函数
@param UniApp.RequestOptions
@returns Promise
返回Promise对象
请求成功:
提取核心数据res.data
添加类型，支持泛型
请求失败：
提示错误
*/

interface Data<T> {
  code: string
  msg: string
  result: T
}
// 封装请求方式，返回一个Promise
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 请求成功
      success(res) {
        // 状态码2XX
        if (res.statusCode >= 200 && res.statusCode <= 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // token 失效
          // 401错误 ->清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          uni.showToast({
            title: (res.data as Data<T>).msg || '请求错误',
            icon: 'error',
          })
        }
      },
      // 请求失败
      fail(err) {
        uni.showToast({
          title: '网络错误',
          icon: 'error',
        })
        reject(err)
      },
    })
  })
}
