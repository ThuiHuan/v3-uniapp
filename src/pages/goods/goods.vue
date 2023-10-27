<script setup lang="ts">
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsData } from '@/types/Goods'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import ServicePanel from './components/ServicePanel.vue'
import AddressPanel from './components/AddressPanel.vue'
import goodsSkeleton from './components/goodsSkeleton.vue'
import type {
  SkuPopupEvent,
  SkuPopupInstance,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import { postMemberCartAPI } from '@/services/carts'

// 骨架屏
let isLoading = ref(false)
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 获取其他页面传递过来的id数据
const query = defineProps<{
  id: string
}>()
// 存储goods数据
const goods = ref<GoodsData>()
// 轮播的下标
const currentIndex = ref(0)
// 弹出层的实例对象
const popup = ref<{
  open: () => void
  close: () => void
}>()
// 控制弹出层条件渲染
const popName = ref<'address' | 'service'>()
// 基于popName的类型拿到具体的类型
const openPopup = (name: typeof popName.value) => {
  // 修改弹出层名称
  popName.value = name
  // 打开弹出层
  popup.value?.open()
}

// 轮播滑动事件
const OnChange = (e: any) => {
  currentIndex.value = e.detail.current
}
// 轮播的点击事件
const full = (url: string) => {
  // 预览Api
  uni.previewImage({
    current: url,
    urls: goods.value!.mainPictures,
  })
}
// 商品信息
const localdata = ref({} as SkuPopupLocaldata)
// 获取数据
const getGoodsData = async () => {
  const res = await getGoodsByIdAPI(query.id)
  goods.value = res.result
  // sku组件所需格式
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map((v) => ({ name: v.name, list: v.values })),
    sku_list: res.result.skus.map((v) => ({
      _id: v.id,
      goods_id: res.result.id,
      goods_name: res.result.name,
      image: v.picture,
      price: (v.price as unknown as number) * 100, // 注意：需要乘以 100
      stock: v.inventory,
      sku_name_arr: v.specs.map((vv) => vv.valueName),
    })),
  }
}
onShow(async () => {
  await getGoodsData()
  isLoading.value = true
})
// 弹窗开关
const isShowSku = ref(false)

enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
// 按钮模式
const mode = ref<SkuMode>(SkuMode.Both)
// 打开弹窗时候修改按钮模式
const openSkuPopup = (val: SkuMode) => {
  isShowSku.value = true
  // 修改按钮模式
  mode.value = val
}

// 计算
// SKU组件实例
const skuPopupRef = ref<SkuPopupInstance>()
// 计算被选中的值
const selectArrText = computed(() => {
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})

// 加入购物车事件
const onAddCart = async (ev: SkuPopupEvent) => {
  await postMemberCartAPI({ skuId: ev._id, count: ev.buy_num })
  uni.showToast({ title: '添加成功' })
  isShowSku.value = false
}

// 立即购买
const onBuyNow = (ev: SkuPopupEvent) => {
  uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${ev._id}&count=${ev.buy_num}` })
}
</script>

<template>
  <!-- sku弹窗组件 -->
  <vk-data-goods-sku-popup
    v-model="isShowSku"
    :localdata="localdata"
    :mode="mode"
    add-cart-background-color="#FFA868"
    buy-now-background-color="#27BA98"
    ref="skuPopupRef"
    :actived-style="{
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#E9F8F5',
    }"
    @add-cart="onAddCart"
    @buy-now="onBuyNow"
  />
  <scroll-view scroll-y class="viewport" v-if="isLoading">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper circular @change="OnChange" :interval="3000" autoplay>
          <swiper-item v-for="item in goods?.mainPictures" :key="item">
            <image class="image" mode="aspectFill" :src="item" @tap="full(item)" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goods?.mainPictures.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goods?.price }}</text>
        </view>
        <view class="name ellipsis">{{ goods?.name }} </view>
        <view class="desc"> {{ goods?.desc }} </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow" @tap="openSkuPopup(SkuMode.Both)">
          <text class="label">选择</text>
          <text class="text ellipsis"> {{ selectArrText }} </text>
        </view>
        <view class="item arrow" @tap="openPopup('address')">
          <text class="label">送至</text>
          <text class="text ellipsis"> 请选择收获地址 </text>
        </view>
        <view class="item arrow" @tap="openPopup('service')">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goods?.details.properties" :key="item.name">
            <text class="label">{{ item.name }}</text>
            <text class="value">{{ item.value }}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          v-for="item in goods?.details.pictures"
          :key="item"
          mode="widthFix"
          class="image"
          :src="item"
        ></image>
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in goods?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goods/goods?id=${item.id}`"
        >
          <image class="image" mode="aspectFill" :src="item.picture"></image>
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>

    <!-- 用户操作 -->
    <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      <view class="icons">
        <button class="icons-button"><text class="icon-heart"></text>收藏</button>
        <!-- #ifdef H5-->
        <button class="icons-button"><text class="icon-handset"></text>客服</button>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <button class="icons-button" open-type="contact">
          <text class="icon-handset"></text>客服
        </button>
        <!-- #endif -->

        <navigator class="icons-button" url="/pages/cart/cartNormal" open-type="navigate">
          <text class="icon-cart"></text>购物车
        </navigator>
      </view>
      <view class="buttons">
        <view class="addcart" @tap="openSkuPopup(SkuMode.Cart)"> 加入购物车 </view>
        <view class="buynow" @tap="openSkuPopup(SkuMode.Buy)"> 立即购买 </view>
      </view>
    </view>
  </scroll-view>
  <goodsSkeleton v-else />
  <!-- 弹出层交互 -->
  <uni-popup ref="popup" type="bottom" style="background-color: #fff">
    <ServicePanel v-if="popName == 'service'" @close="popup?.close()" />
    <AddressPanel v-if="popName == 'address'" @close="popup?.close()" />
  </uni-popup>
</template>

<style lang="scss">
@import './components/styles/goods.scss';
</style>
