const addressIndex = require('../../config').addressIndex

var user_id = ""
var app = getApp();
Page({
  data: {
    userAddRess: [
      {
        userName: "",
        userPhone: "",
        userPhonetwo: "",
        takepro: "",
        takecity: "",
        takearea: "",
        takestreet: ""
      }
    ],
    none: false
  },
  onLoad: function () {
   

  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (wx.getStorageSync("userinfo")) {
      user_id = wx.getStorageSync("userinfo").userId
    } else {
      wx.navigateTo({  //  若没登录跳转登录
        url: '../login/login'
      })
    }
    var ajaxData = {"user_id": user_id}
    wx.request({
      url: addressIndex,
      data: JSON.stringify(ajaxData),
      method: 'POST',
      success: function (res) {
        console.log(res.data.code)
        if (res.data.code == "1") {
          var data = res.data.data
          console.log(data);
          var list_arr = [];
          for (var i = 0; i < data.length; i++) {
            var list_obj = {
              userName: data[i].user_name,
              userPhone: data[i].user_phone,
              userPhonetwo: data[i].user_phone_two,
              takepro: data[i].take_pro,
              takecity: data[i].take_city,
              takearea: data[i].take_area,
              takestreet: data[i].take_street
            }
            list_arr.push(list_obj)
          }
          that.setData({
            userAddRess: list_arr,
            none: true
          })
        } else {
          that.setData({
            none: false
          })
          console.log(that.data.none);
        }

      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  address: function () {
    wx.navigateTo({
      url: '../addRess/addRess'
    })
  },
  click: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    wx.setStorage({
      key: 'key',
      data: index
    })
    wx.redirectTo({
      url: '../placeOrder/placeOrder'
    })
  }
})