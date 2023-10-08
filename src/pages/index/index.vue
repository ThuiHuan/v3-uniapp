<template>
  <!-- 顶部导航 -->
  <NavBar />
  <scroll-view
    refresher-enabled
    @refresherrefresh="Onrefresherrefresh"
    :refresher-triggered="flag"
    @scrolltolower="onScrollToLower"
    class="scoll"
    scroll-y
  >
    <!-- 骨架屏 -->
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <!-- 轮播图 -->
      <XmlSwiper :list="bannerList" />
      <!-- 分类 -->
      <CategoryPanel :CatergoryList="Catergory" />
      <!-- 热门推荐 -->
      <HotPanel :hotPanelList="hotPanelList" />
      <!-- 猜你喜欢 -->
      <XmlGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
// 引入子组件
import NavBar from './components/NavBar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'
// 引入API
import { getHomeBannerApi, getHomeCategoryApi, getHotPanel } from '@/services/Home'
// 引入生命周期
import { onLoad } from '@dcloudio/uni-app'
// 引入类型
import type { BannerItem, CategoryItem, HotPanelItem } from '@/types/Home'
import { ref } from 'vue'
import XmlGuess from '@/components/XmlGuess.vue'
import type { XmlGuessInstance } from '@/types/component'

// 存储轮播图数据
const bannerList = ref<BannerItem[]>([])
// 存储分类数据
let Catergory = ref<CategoryItem[]>([])
// 存储热门推荐数据
let hotPanelList = ref<HotPanelItem[]>([])
// 获取猜你喜欢组件实例
const guessRef = ref<XmlGuessInstance>()
// 动画的开关
const flag = ref(true)
// 是否显示骨架屏
const isLoading = ref(false)

// 获取轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerApi()
  bannerList.value = res.result
}
// 请求分类数据
const getCategory = async () => {
  const res = await getHomeCategoryApi()
  Catergory.value = res.result
}
// 请求推荐数据
const getPanel = async () => {
  const res = await getHotPanel()
  hotPanelList.value = res.result
}
// 下拉刷新
const Onrefresherrefresh = async () => {
  // 开启动画
  flag.value = true
  // 数据加载
  // await getHomeBannerData()
  // await getCategory()
  // await getPanel()
  guessRef.value?.resetData()
  await Promise.all([getHomeBannerData(), getCategory(), getPanel(), guessRef.value?.getMore()])
  // 重置猜你喜欢数据
  // 关闭动画
  flag.value = false
}

// 页面加载的生命周期
onLoad(async () => {
  // 显示骨架屏
  isLoading.value = true
  await Promise.all([getHomeBannerData(), getCategory(), getPanel()])
  // 关闭骨架屏
  isLoading.value = false
})

// 滚动触底事件
const onScrollToLower = () => {
  guessRef.value?.getMore()
}
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100%;
  .scoll {
    flex: 1;
  }
}
</style>
