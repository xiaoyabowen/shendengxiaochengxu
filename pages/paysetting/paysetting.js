// pages/serviceSetting/serviceSetting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 登陆未登录判断
    setLogin: false,
    // 登陆装提案对应的内容
    settingLogin: {
      setLoginImg: "../../../../images/set-guan.png",
      setDate: "2018-12-12",
      setSucfont: "恭喜你，已开通年费"
    },
    // 未登陆装提案对应的内容
    settingNoneLogin: {
      setLoginImg: "../../../../images/set-guan-sub.png",
      setSucfont: "您还未开通套餐!"
    },

    // 各种支付类型数据
    settings: [
      {
        bar: "年付",
        price: "170"
      },
      {
        bar: "季付",
        price: "70"
      },
      {
        bar: "月付",
        price: "40"
      },
      {
        bar: "次付",
        price: "20"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})