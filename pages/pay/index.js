/**
 * 1.页面加载的时候
 *  1.从缓存中获取购物车数据 渲染到页面中
 *    这些数据 checked=true
 * 2.微信支付
 *   1.哪些人 哪些账号 可以实现微信支付
 *   2.企业账号
 *      1.一个appid 可以同时绑定多个开发者
 *      2.这些开发者就可以用这个appid 和 它的开发权限
 * 3.支付按钮
 *  1.先判断缓存中有没有token
 *  2.没有跳转到授权页面 进行token
 *  3.有token
 *  4.创建订单 获取订单编号
 *  5.已经完成了微信支付
 *  6.手动删除缓存中 已经被选中了的商品
 *  7.删除后的购物车数据 填充加缓存
 *  8.再跳回订单页面
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx"
import "../../lib/runtime/runtime"// pages/goods_detail/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取本地存储的地址数据
    const address = wx.getStorageSync('address')
    //  获取缓存中的数据
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)

    // 1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum += v.num

    })

    this.setData({
      cart, totalPrice, totalNum, address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 1.判断缓存中有没有token
      const token = wx.getStorageSync('token');
      // 2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return;
      }
      // 3.创建订单
      //  3.1准备请求头参数
      const header = { Authorization: token }
      //  3.2准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      let data = {
        order_price,
        consignee_addr,
        goods
      }
      // 4.创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", data: data, method: "post" })
      // 5.发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", data: { order_number }, method: "post" })
      // 6.发起微信支付,因为用的 AppID 与实际生成支付参数时用的 AppID 不同，报错不能支付
      const res = await requestPayment(pay);
      console.log(res);
      // 7.查询后台 订单状态
      const res2 = await request({ url: "/my/orders/chkOrder", data: { order_number }, method: "post" })
      await wx.showToast({
        title: '支付成功',
      })
      // 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart)
      // 8.支付成功了 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })


    } catch (error) {
      await wx.showToast({
        title: '支付失败',
      })
      console.log(error);

    }


  }

})