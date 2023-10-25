import type { XmlGuessInstance } from '@/types/component'
import { ref } from 'vue'

// 暴露滚动函数
export const useGuessList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XmlGuessInstance>()
  // 滚动方法
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }
  // 返回出去给外部使用
  return {
    guessRef,
    onScrolltolower,
  }
}
