<script setup lang="ts">
import { postLoginWxminApi } from '@/services/login'
import { useMemberStore } from '@/stores'
import type { LoginResult } from '@/types/login'
import { onLoad } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { ref } from 'vue'

// #ifdef MP-WEIXIN
// 存储用户的数据
let code = ''
onLoad(async () => {
  const res = await wx.login()
  code = res.code
})
// 获取用户手机号码
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  // const encryptedData = ev.detail!.encryptedData!
  // const iv = ev.detail!.iv!
  const res = await postLoginWxminApi('15671615868')
  loginSuccess(res.result as LoginResult)
}
// #endif

// 模拟手机号快捷登录
const onGetphoneLogin = async () => {
  const res = await postLoginWxminApi('15671615868')
  loginSuccess(res.result as LoginResult)
}

// 登录成功
const loginSuccess = async (data: LoginResult) => {
  const memberStore = useMemberStore()
  // 保存会员信息
  await memberStore.setProfile(data)
  // 成功提示
  uni.showToast({
    icon: 'none',
    title: '登录成功',
  })
  setTimeout(() => {
    // 页面跳转
    uni.switchTab({ url: '/pages/my/my' })
  }, 500)
}

// #ifdef H5
const phoneNumber = ref('')
// 正则表达式校验规则
const phonePattern = /^1[3456789]\d{9}$/
let isValidPhoneNumber = ref(true)
// 输入框失焦事件
const validateNumber = () => {
  // 使用正则表达式进行校验
  setTimeout(() => {
    isValidPhoneNumber.value = phonePattern.test(phoneNumber.value)
  }, 1000)
}
// 登录事件
const loginIn = async () => {
  //失败
  if (!isValidPhoneNumber.value || phoneNumber.value.length == 0) {
    uni.showToast({
      icon: 'error',
      title: '请输入正确的账号',
    })
    return
  } else {
    // 正确
    const res = await postLoginWxminApi(phoneNumber.value)
    loginSuccess(res.result as LoginResult)
  }
}
// #endif
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image src="../../static/images/logo_icon.svg"></image>
    </view>
    <view class="login">
      <!-- 网页端表单登录 -->
      <!-- #ifdef H5 -->
      <span
        v-if="!isValidPhoneNumber"
        style="
          color: rgb(222, 0, 0);
          margin: 0 auto;
          margin-bottom: 5px;
          font-size: 14px;
          margin-top: -15px;
        "
        >请输入正确的手机号</span
      >
      <input
        class="input"
        type="text"
        v-model="phoneNumber"
        placeholder="请输入用户名/手机号码"
        @input="validateNumber"
      />

      <button class="button phone" @tap="loginIn">登录</button>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <!-- 小程序端授权登录 -->
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
        <text class="icon icon-phone"></text>
        手机号快捷登录
      </button>
      <!-- #endif -->

      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 通用模拟登录 -->
          <button @tap="onGetphoneLogin">
            <text class="icon icon-phone">模拟快捷登录</text>
          </button>
        </view>
      </view>
      <view class="tips">登录/注册即视为你同意《服务条款》和《Xmall隐私协议》</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
  image {
    width: 520rpx;
    height: 520rpx;
    margin-top: 5vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;
    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;
    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;
      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;
      button {
        padding: 0;
        background-color: transparent;
      }
      button::after {
        border: 1px solid #fff;
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }
    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  flex: 1;
  position: relative;
  top: 200rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
