<script setup lang="ts">
import { getGuessLikeApi } from '@/services/Home'
import type { GuessLike } from '@/types/Home'
import { onMounted, ref } from 'vue'
let guessLikeList = ref<GuessLike[]>([])
const page = ref(1)
const pagesize = ref(4)
// 分页结束的标记
const finish = ref(false)

// 请求猜你喜欢数据
const getGuess = async () => {
  // 退出判断

  if (finish.value === true) {
    return uni.showToast({
      icon: 'none',
      title: '没有更多的数据了',
    })
  }
  const res = await getGuessLikeApi(page.value, pagesize.value)
  // 数组追加 展开数组避免累加
  guessLikeList.value.push(...res.result.items)
  // 分页条件
  if (page.value < res.result.pages) {
    page.value++
  } else {
    finish.value = true
  }
}
onMounted(() => {
  getGuess()
})

// 重置数据
const resetData = () => {
  page.value = 1
  guessLikeList.value = []
  finish.value = false
}

//暴露方法
defineExpose({
  // 请求更多
  getMore: getGuess,
  // 重置数据
  resetData: resetData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessLikeList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name">{{ item.name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view v-if="!finish" class="loading-text"> 正在加载... </view>
  <view v-else class="loading-text">暂无更多</view>
</template>

<style lang="scss">
@import '@/components/styles/XmlGuess.scss';
</style>
