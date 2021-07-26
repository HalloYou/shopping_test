import { request } from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1. 发送异步请求获取转播图数据， 优化的手段通过es6的promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata', //仅为示例，并非真实的接口地址
    //   success: (res) => {
    //     this.setData({
    //       swiperList: res.data.message
    //     })
    //     // console.log(res.data,this.swiperList)
    //   }
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();

  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  // 获取分类导航数据
  getCateList() {
    request({ url: "/home/catitems" }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({ url: "/home/floordata" }).then(result => {
      this.setData({
        floorList: result
      })
    })
  },
  // url跳转不了,少了个 index
  toGoodsList(e) {
    let { src } = e.currentTarget.dataset;
    // /pages/goods_list/index?query=爆款
    // /pages/goods_list/index?cid=5
    src = src.replace(/goods_list/, "goods_list/index")
    console.log(src);
    wx.navigateTo({
      url: src,
    })
  }


})