import type { GoodsData } from '@/types/Goods'
import { http } from '@/utils/http'
// import type { GoodsResult } from '@/types/Hot'
export const getGoodsByIdAPI = (id: string) => {
  return http<GoodsData>({
    method: 'GET',
    url: '/goods',
    data: { id },
  })
}
