// 热门推荐页面的请求
import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/Hot'
//通用推荐接口 特惠推荐等  &拓展类型
export const getHotRecommendApi = (url: string, data?: PageParams & { id?: string }) => {
  return http<HotResult>({
    method: 'GET',
    url,
    data: {
      // 第一个
      data,
    },
  })
}