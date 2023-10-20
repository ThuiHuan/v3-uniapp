import type { LoginParams } from '@/types/login'
import { http } from '@/utils/http'

export const postLoginWxminApi = (phoneNumber: string) => {
  return http({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber: phoneNumber,
    },
  })
}
