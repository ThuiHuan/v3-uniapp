import type { BannerItem, CategoryItem, GuessLike, HotPanelItem } from '@/types/Home'
import type { PageResult } from '@/types/global'
import { http } from '@/utils/http'
// 获取首页的轮播图数据
export const getHomeBannerApi = () => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      // 第一个
      distributionSite: 1,
    },
  })
}
// 获取首页的前台组件数据
export const getHomeCategoryApi = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}
// 获取首页热门推荐的组件数据
export const getHotPanel = () => {
  return http<HotPanelItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}
// 获取首页热门推荐的组件数据
export const getGuessLikeApi = (page?: number, pageSize?: number) => {
  return http<PageResult<GuessLike>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data: {
      page: page,
      pageSize: pageSize,
    },
  })
}
