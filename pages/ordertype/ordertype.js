const orderuser = require('../../config').orderuser
const complatedBut = require('../../config').complatedBut
// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    selected2: false,
    selected3: false,
    selected5: false,
    orderList: [{
      d_id: "",//订单状态
      num: "",//订单编号
      time_fa: "",//发起时间
      time_yu: "",//预约时间
      name: "",//预约人姓名
      tel: "",//预约人电话
      address_qu: "",//取卡地址
      address_yi: "",//医院地址
      address_sh:"",
      pay: "",//支付方式
      bal: "",//支付余额
      server_name: "",//服务人姓名
      gobtn: "",//按钮文字
      studytext: "",//状态文字
      hidden: true,
      queren:""
    }],
    error: "",
    none: true,
    userId: ""
  },
  gofu: function (e) {
    var that = this;
    var n = e.target.dataset.i;
    var num = that.data.orderList[n].num
    wx.navigateTo({
      url: '../payoff/payoff?number=' + num
    })
  },
  selected: function (e) {
    this.setData({
      selected: false,
      selected2: false,
      selected3: false,
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false,
      selected3: false,
      selected5: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true,
      selected3: false,
      selected5: false,
    })
  },
  selected3: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: false,
      selected5: false,
      selected3: true
    })
  },
  selected5: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: false,
      selected5: true,
      selected3: false
    })
  },
  hiddenBtn: function (e) {
    var that = this;
    // 获取事件绑定的当前组件
    var index = e.currentTarget.dataset.index;
    // 获取list中hidden的值
    // 隐藏或显示内容
    var hid = that.data.orderList[index].hidden;
    for (var i in this.data.orderList) {
      this.data.orderList[i].hidden = true;
    }
    that.data.orderList[index].hidden = !hid;
    that.setData({
      orderList: that.data.orderList
    })
  },
  submit: function (e) { //点击传递该条数据的订单号
    var that = this;
    var n = e.target.dataset.i;
    var url = "";
    var num = that.data.orderList[n].num;

    url = "../publish/publish?number=" + num
    wx.navigateTo({
      url: url,
      success: function (res) {
        console.log(res);
      }
    })


  },
  queren: function (e) {
    var that = this;
    var n = e.target.dataset.i;
    var num = that.data.orderList[n].num;
    console.log(num)
    wx: wx.request({
      url: complatedBut,
      data: {
        order_number: num
      },
      method: 'POST',
      success: function (res) {
        var key = 'orderList['+ n +'].qr_status'
        that.setData({
          [key]:2
        })

        

        wx.showModal({
          title: '提示',
          content: '正在确认，请耐心等待...',
          showCancel: false
        })
      }
    })
  },
  onLoad: function (options) {

    var that = this;
    if (wx.getStorageSync("userinfo")) {
      var userinfo = wx.getStorageSync("userinfo")
      that.setData({
        userId: userinfo.userId
      });
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }

    wx.showLoading({
      title: '加载中',
    })
    // 页面加载  判断按钮文字

    // 页面请求数据
    wx.request({
      url: orderuser,
      data: {
        user_id: that.data.userId
      },
      method: 'POST',
      success: function (res) {

        var data = res.data.data;
        var code = res.data.code;
        console.log(data)
        console.log(res)
        if (code == 200) {
          var discuss_arr = [];
          for (var i = 0; i < data.length; i++) {
            var target = {
              d_id: 1,
              num: data[i].order_number,
              time_fa: data[i].create_time,
              time_yu: data[i].pre_time,
              name: data[i].order_user_name,
              tel: data[i].order_user_phone,
              address_qu: data[i].talk_address,
              address_yi: data[i].hospital_address,
              address_sh: data[i].collect_address,
              pay: data[i].order_payment_type,
              bal: data[i].order_pay_price,
              server_name: data[i].service_name,
              server_phone: data[i].service_phone,
              studytext: data[i].order_status_info,
              hidden: true,
              qr_status: data[i].qr_status
            }
            discuss_arr.push(target)
          }
          that.setData({
            orderList: discuss_arr,
            error: false
          })
        } else {
          that.setData({
            error: true
          })
        }
      }

    })


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
    // 页面加载  判断按钮文字
    var that = this;
    // 页面请求数据
    wx.request({
      url: orderuser,
      data: {
        user_id: that.data.userId
      },
      method: 'POST',
      success: function (res) {
        var data = res.data.data;
        var code = res.data.code;
        console.log(data)
        console.log(res)
        if (code == 200) {
          var discuss_arr = [];
          for (var i = 0; i < data.length; i++) {
            var target = {
              d_id: 1,
              num: data[i].order_number,
              time_fa: data[i].create_time,
              time_yu: data[i].pre_time,
              name: data[i].order_user_name,
              tel: data[i].user_phone,
              address_qu: data[i].talk_address,
              address_yi: data[i].hospital_address,
              address_sh: data[i].collect_address,
              pay: data[i].order_payment_type,
              bal: data[i].order_pay_price,
              server_name: data[i].service_name,
              studytext: data[i].order_status_info,
              server_phone: data[i].service_phone,
              hidden: true,
              qr_status: data[i].qr_status
            }
            discuss_arr.push(target)
          }
          that.setData({
            orderList: discuss_arr,
            error: false
          })
        } else {
          that.setData({
            error: true
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
      },

    })


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
console.log(8888888)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})