import XmlSwiper from '@/components/XmlSwiper.vue'
import XmlGuess from '@/components/XmlGuess.vue'
import 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    XmlSwiper: typeof XmlSwiper
    XmlGuess: typeof XmlGuess
  }
}

// 定义组件实例类型
export type XmlGuessInstance = InstanceType<typeof XmlGuess>
