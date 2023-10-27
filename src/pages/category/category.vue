<script setup lang="ts">
import { getHomeBannerApi } from '@/services/Home'
import { getCategoryTopAPI } from '@/services/category'
import type { BannerItem } from '@/types/Home'
import type { CategoryTopItem } from '@/types/category'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import categorySekelecton from './components/categorySekelecton.vue'

// 轮播图数据
let bannerData = ref<BannerItem[]>([])
// 一级分类数据
let TopData = ref<CategoryTopItem[]>([])
// 一级分类的高亮标记
let activeIndex = ref(0)
// 存储二级分类的数据
let SecendData = computed(() => {
  // 返回当前一级分类高亮的下标对应的数据
  return TopData.value[activeIndex.value]?.children || []
})
// 骨架屏的标记
let isLoading = ref(false)

//获取轮播图的数据
const getBannerData = async () => {
  const res = await getHomeBannerApi()
  bannerData.value = res.result
}
// 获取一级分类数据
const getTop = async () => {
  const res = await getCategoryTopAPI()
  TopData.value = res.result
}
onLoad(async () => {
  // 获取轮播图数据
  await Promise.all([getBannerData(), getTop()])
  isLoading.value = true
})
// // 页面加载
// onShow(() => {
//   // 获取轮播图数据
//   getBannerData()
//   getTop()
// })
</script>

<template>
  <view class="viewport" v-if="isLoading">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">女靴</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in TopData"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name"> {{ item.name }}</text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view class="secondary" scroll-y>
        <!-- 轮播图 -->
        <view class="swiper">
          <swiper indicator-dots autoplay circular :interval="3000">
            <swiper-item v-for="item in bannerData" :key="item.id">
              <image class="image" :src="item.imgUrl" mode="scaleToFill" />
            </swiper-item>
          </swiper>
        </view>
        <!-- 内容区域 -->
        <view class="panel" v-for="item in SecendData" :key="item.id">
          <view class="title">
            <text class="name">{{ item.name }}</text>
            <navigator class="more" hover-class="none">全部</navigator>
          </view>
          <view class="section">
            <navigator
              v-for="good in item.goods"
              :key="good.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${good.id}`"
            >
              <image class="image" :src="good.picture"></image>
              <view class="name ellipsis">{{ good.name }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ good.price }}</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
  <categorySekelecton v-else />
</template>

<style lang="scss">
@import './styles/category.scss';
</style>
