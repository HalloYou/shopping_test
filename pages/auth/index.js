import "../../lib/runtime/runtime"// pages/goods_detail/index.js
import { login } from "../../utils/asyncWx"
import { request } from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取用户授权
  async handleGetUserInfo(e) {
    try {
      // 1.获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2.获取小程序登录成功后的code
      const { code } = await login()
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 3.发送请求获取用户的token
      const res = await request({ url: "/users/wxlogin", data: loginParams, method: "post" })
      // console.log(res)   //需要企业账号
      if (!res) {
        // 4.把token存入缓存中 同时跳转回上一个页面
        wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
        wx.navigateBack({
          delta: 1    //返回上个页面
        })
      }

    } catch (error) {
      console.log(error);
    }
  }
})