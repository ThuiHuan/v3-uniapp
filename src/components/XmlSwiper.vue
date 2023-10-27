<script setup lang="ts">
import type { BannerItem } from '@/types/Home'
import { ref } from 'vue'

// 指示点
const activeIndex = ref(0)
// 改变swiper的下标  uniHelper给出的类型
const onChange: UniHelper.SwiperOnChange = (e) => {
  // 非空断言
  activeIndex.value = e.detail!.current
}

// 接收父组件传递的值
const prop = defineProps<{
  list: BannerItem[]
}>()
</script>

<template>
  <view class="carousel">
    <swiper @change="onChange" :circular="true" autoplay :interval="3000">
      <swiper-item v-for="item in prop.list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
@import '@/components/styles/XmlSwiper.scss';
</style>
