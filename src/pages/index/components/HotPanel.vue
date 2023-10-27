<!-- 热门推荐 -->
<script setup lang="ts">
import type { HotPanelItem } from '@/types/Home'

defineProps<{
  hotPanelList: HotPanelItem[]
}>()
</script>

<template>
  <!-- 推荐专区 -->
  <view class="panel hot">
    <view class="item" v-for="item in hotPanelList" :key="item.id">
      <view class="title">
        <text class="title-text">{{ item.title }}</text>
        <text class="title-desc">{{ item.alt }}</text>
      </view>
      <navigator hover-class="none" :url="`/pages/hot/hot?type=${item.type}`" class="cards">
        <image
          v-for="img in item.pictures"
          :key="img"
          class="image"
          mode="aspectFit"
          :src="img"
        ></image>
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
@import './styles/HotPanel.scss';
</style>
