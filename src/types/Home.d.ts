/** 首页-广告区域数据类型 */
export type BannerItem = {
  /** 跳转链接 */
  hrefUrl: string
  /** id */
  id: string
  /** 图片链接 */
  imgUrl: string
  /** 跳转类型 */
  type: number
}
//首页-分类模块数据类型
export type CategoryItem = {
  icon: string
  id: string | number
  name: string
}
// 首页热门推荐的组件数据类型
export type HotPanelItem = {
  alt: string
  id: string | number
  pictures: string[]
  target: string
  title: sting
  /** 推荐类型 */
  type: string
}
// 猜你喜欢
export type GuessLike = {
  desc: string
  id: string
  name: string
  // 当前页数
  orderNum: number
  picture: string
  price: string
}
