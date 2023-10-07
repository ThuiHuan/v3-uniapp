// src/types/components.d.ts
import XmlSwiper from '@/components/XmlSwiper.vue'
declare module 'vue' {
  export interface GlobalComponents {
    XmlSwiper: typeof XmlSwiper
  }
}
