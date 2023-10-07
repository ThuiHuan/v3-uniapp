import type { BannerItem } from '@/types/Home'
import { http } from '@/utils/http'
// 获取首页的轮播图数据
export const getHomeBannerApi = () => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite: 1,
    },
  })
}
