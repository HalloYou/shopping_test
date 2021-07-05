import {
  request
} from "../../request/index";
import "../../lib/runtime/runtime"

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的菜单数据
    rightContent: [],
    // 接口的返回数据
    Cates: [],
    // 左侧标题被选中样式
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1.判断本地存储有没有旧的数据
     *  web: localStorage.setItem("key","value") localStorage.getItem("key")
     *  小程序： wx.setStorageSync("key","value") wx.getStorageSync("key")
     * 2.没有直接发请求
     *  {time:Data.now(),data:[]}
     * 3.有旧数据，同时旧数据没有过期，就使用本地存储的旧数据即可
     * */

    // 1. 获取本地数据
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      // 不存在 发送请求数据
      this.getCates();
    } else {
      // 有旧的数据，定义过期时间 10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;

        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)

        // 构造右侧的菜单数据
        let rightContent = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then((res) => {
    //   console.log(res)
    //   this.Cates = res;

    //   // 把接口的数据存入本地存储中
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name)

    //   // 构造右侧的菜单数据
    //   let rightContent = this.Cates[0].children

    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })

    let res = await request({ url: "/categories " })
    this.Cates = res;
    // 把接口的数据存入本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧的菜单数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单点击事件
  handleItemTap(e) {
    /*  
       1. 获取被点击的标题身上的索引
       2. 给data中的currentIndex赋值
       3. 根据不同的索引渲染数据
    */
    //  console.log(e)
    const { index } = e.currentTarget.dataset;
    // 构造右侧的菜单数据
    let rightContent = this.Cates[index].children

    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })

  },
})