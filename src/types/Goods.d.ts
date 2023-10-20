// =======================brand===================
export interface brand {
  desc: null
  id: string
  logo: string
  name: string
  nameEn: string
  picture: string
  place: null
  type: null
}
// =======================categories===================
export interface categories {
  id: '109264007'
  layer: 2
  name: '名酒馆'
  parent: parentData[]
}
export interface parentData {
  id: '1005002'
  name: '美食'
  layer: 1
  parent: null
}
// =======================details===================
export interface parent {
  pictures: string[]
  properties: properties[]
}
export interface properties {
  name: string
  value: string
}
//=======================hotByDay===================
export interface hotByDay {
  desc: string
  id: string
  name: string
  orderNum: number
  picture: string
  price: string
}
//=======================similarProducts===================
export interface similarProducts {
  desc: string
  id: string
  name: string
  orderNum: number
  picture: string
  price: string
}
//=======================skus===================
export interface skus {
  id: string
  inventory: number
  oldPrice: string
  picture: string
  price: string
  skuCode: string
  specs: specsData[]
}
export interface specsData {
  name: string
  valueName: string
}
//=======================specs===================
export interface specs {
  id: string
  name: string
  values: values[]
}
export interface values {
  desc: string
  name: string
  picture: string
}
// 数据
export interface GoodsData {
  brand: brand[]
  categories: categories[]
  collectCount: number
  commentCount: number
  desc: string
  details: parent
  discount: number
  evaluationInfo: null
  hotByDay: hotByDay[]
  id: string
  inventory: number
  isCollect: null
  isPreSale: boolean
  mainPictures: string[]
  mainVideos: []
  name: string
  oldPrice: string
  price: string
  recommends: null
  salesCount: number
  similarProducts: similarProducts[]
  skus: skus[]
  specs: specs[]
  spuCode: string
  userAddresses: null
  videoScale: number
}
