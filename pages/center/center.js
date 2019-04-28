//index.js
var paymentIf = require("../../config").paymentIf
var app = getApp()
Page({
  data: {
    userId:"",
    headimg: "",
    username: "",
    tel: "",
    ren: "",
    // text:"这是一个页面"
    actionSheetHidden: true,
    // actionSheetItems: [
    //   { bindtap: 'Menu1', txt: '拍照' },
    //   { bindtap: 'Menu2', txt: '从手机相册选择' }
    // ],
    // menu: ''
  },
  onLaunch: function () {

  },
  onLoad: function (options){
    wx.showLoading({
      title: '加载中',
    })
  },
  onShow: function(){
    var that = this;
    if (wx.getStorageSync("userinfo").phone) {
      var userinfo = wx.getStorageSync("userinfo")
      var phone5 = userinfo.phone
      phone5 = phone5.substr(0, 3) + "****" + phone5.substr(7)
      that.setData({
        userId: userinfo.userId,
        headimg: userinfo.avatarUrl,
        username: userinfo.nickName,
        tel: phone5,
      });
     console.log(userinfo)
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }

    wx.request({
      url: paymentIf,
      data: {
        user_id: wx.getStorageSync("userinfo").userId,
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          ren: res.data.code
        })
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  }

})