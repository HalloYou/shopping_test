/**
 * 1.点击“+”触发tap点击事件
 *  1.调用小程序内置 选择图片的api
 *  2.获取到 图片的路径 数组
 *  3.把图片路径 存到data的变量中
 *  4.页面就可以根据 图片数组 进行循环显示 自定义组件
 * 2.点击自定义图片组件
 *  1.获取被点击的元素的索引
 *  2.获取data中的图片数据
 *  3.根据索引 数组中删除对应的元素
 *  4.把数组重新设置回data中
 * 3.点击“提交”
 *  1.获取文本框的内容
 *  2.对这些内容 合法性验证
 *  3.验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片的外网链接
 *    1.遍历图片数组
 *    2.挨个上传
 *    3.自己再维护图片数组 存放  图片上传后的外网的链接
 *  4.文本域 和 外网的图片的路径 一起提交到服务器
 *  5.清空当前页面
 *  6.返回上一页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品/商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径数组
    chooseImgs: [],
    // 文本框的内容
    textVal: ''
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],
  // 标题点击事件 从子组件传过来的
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击“+”选择图片
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中图片数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册照相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      },
    })
  },
  // 点击自定义图片
  handleRemoveImg(e) {
    // 2.获取被点击的图片索引
    const { index } = e.currentTarget.dataset;
    // 3.获取data中的图片数组
    let chooseImgs = this.data.chooseImgs;
    // 4.删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit() {
    // 1.获取文本框内容 图片数组

    const { textVal, chooseImgs } = this.data;
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return;
    }
    // 准备上传图片到专门的服务器
    // 上传文件的api不支持 多个文件同时上传 遍历数组 挨个上传

    chooseImgs.forEach((v, i) => {
      wx.uploadFile({
        // 上传路径
        filePath: v,
        // 上传的文件名称 后台来来获取文件
        name: 'file',
        // 图片上传到哪里
        url: 'https://api.uomg.com/api/image.ali',
        // 顺带的文本信息
        formData: {},
        success: (res) => {
          console.log(res);
        }
      })
    })
  }
})