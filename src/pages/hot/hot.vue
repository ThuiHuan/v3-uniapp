// /src/pages/hot/hot.vue
<script setup lang="ts">
import { getHotRecommendApi } from '@/services/Hot'
import type { SubTypeItem } from '@/types/Hot'
import type { PageParams } from '@/types/global'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
// uniapp接收页面参数
const query = defineProps<{
  type: string
}>()

// 高亮的下标
const activeIndex = ref(0)
// 请求的顶部图片
const bannerPicture = ref('')
// 请求的类型对应的数据
const subTypes = ref<(SubTypeItem & { finish?: boolean })[]>([])
// 寻找需要的type
const currHotType = hotMap.find((v) => v.type === query.type)
// 动态设置标题
uni.setNavigationBarTitle({ title: currHotType!.title })

// 获取热门推荐数据
const getHotRecommendData = async () => {
  const res = await getHotRecommendApi(
    currHotType!.url,
    import.meta.env.DEV ? '' : '',
    // 技巧：环境变量，开发环境，修改初始页面方便测试分页结束
    import.meta.env.DEV ? 33 : 1,
  )
  // 顶部图片
  bannerPicture.value = res.result.bannerPicture
  // 当前类型的数据
  subTypes.value = res.result.subTypes
}

// 页面加载
onLoad(() => {
  getHotRecommendData()
})
// 滑动触底事件
const onScrollToLower = async () => {
  // console.log(subTypes.value)
  // console.log(subTypes.value[activeIndex.value])
  // 获取当前选项对应的数据
  const currsubTypes = subTypes.value[activeIndex.value]
  // 分页条件
  if (currsubTypes.goodsItems.page < currsubTypes.goodsItems.pages) {
    // 当前页码累加
    currsubTypes.goodsItems.page++
  } else {
    // 标记已结束
    currsubTypes.finish = true
    // 退出并轻提示
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }
  const res = await getHotRecommendApi(
    currHotType!.url,
    currsubTypes.id,
    currsubTypes.goodsItems.page,
  )
  // 请求来的数据
  const newsubTypes = res.result.subTypes[activeIndex.value]
  //  存储商品数据.数组追加
  currsubTypes.goodsItems.items.push(...newsubTypes.goodsItems.items)
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <!-- 通过index来匹配动态类名绑定中的index -->
      <text
        v-for="(item, index) in subTypes"
        :key="item.id"
        class="text"
        :class="{ active: activeIndex === index }"
        @tap="activeIndex = index"
        >{{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      scroll-y
      class="scroll-view"
      v-for="(item, index) in subTypes"
      v-show="activeIndex === index"
      :key="item.id"
      @scrolltolower="onScrollToLower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">
        {{ item.finish ? '没有更多数据了~' : '正在加载...' }}
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.scroll-view {
  flex: 1;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
