<template>
  <view>
    <NavBar />
  </view>
  <XmlSwiper :list="bannerList" />
  <CategoryPanel />
  <view>index</view>
</template>

<script setup lang="ts">
// 引入子组件
import NavBar from './components/NavBar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
// 引入API
import { getHomeBannerApi } from '@/services/Home'
// 引入生命周期
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
// 引入类型
import type { BannerItem } from '@/types/Home'
// 存储轮播图数据
const bannerList = ref<BannerItem[]>([])

// 获取轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerApi()
  bannerList.value = res.result
}
// 页面加载的生命周期
onLoad(() => {
  getHomeBannerData()
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
</style>
