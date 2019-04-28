// pages/payoff/payoff.js
const chargeShow = require("../../config").chargeShow
const orderPay = require("../../config").orderPay
const paynumber = require("../../config").paynumber
const wxCode = require("../../config").wxCode
// const pays = require("../../config").pays
var userId = wx.getStorageSync("userinfo").userId
var ajaxData = {
  user_id: userId,
  order_number: "",
  order_payment_type: "",
  payment_type_id:"",
  payment_price:"",
  order_pay_price: ""
}
var getDataFlag = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: userId,
    allNnb: "",   //  剩余次数
    openstudy: "",
    if_info:"",
    ci_money: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  open_btn: function () {

    wx.redirectTo({
      url: '../serviceSetting/serviceSetting',
    })
  },
  onLoad: function (options) {

    var usid = wx.getStorageSync("userinfo").userId
    
    ajaxData.order_number = options.number

    var that = this;
    wx.showLoading({
      title: "加载中...",
    })

    wx.request({
      url: chargeShow,
      data: {
        user_id:usid
      },
      method: 'POST',
      success: function (res) {
        console.log(1)
        console.log(res.data.data.if_info)
        console.log(1)
        that.setData({
          if_info: res.data.data.if_info
        })
        
        if (res.data.data.if_info == 1) {
          ajaxData.order_payment_type = res.data.data.user_payment.payment_type_name
          ajaxData.user_id = res.data.data.user_payment.user_id
          that.setData({
            openstudy: true,
            allNnb: res.data.data.user_payment.payment_number
          })
        } else {
          ajaxData.payment_type_id = res.data.data.payment_info[3].payment_type_id
          ajaxData.payment_price = res.data.data.payment_info[3].payment_price
          that.setData({
            ci_money: "10"
          })
        }

      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  submit: function () {
    var that = this
    
    if (getDataFlag) {
      return;
    }

   
      wx.showLoading({
        title: '加载中',
      })
      getDataFlag = true;
      if (this.data.openstudy) { //  开通套餐逻辑
        console.log(ajaxData)
        wx.request({
          url: orderPay,
          data: ajaxData,
          method: 'POST',
          success: function (res) {

            if (res.data.code == "1") {
              wx.redirectTo({
                url: '../ordertype/ordertype'
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          },
          complete: function () {
            wx.hideLoading()
            getDataFlag = false;
          }
        })
      } else { //  未开通逻辑
        console.log(ajaxData)
        wx.login({
          success: function (res) {
            console.log(res.code)
            if (res.code) {
              //发起网络请求
              wx.request({
                url: wxCode,
                method: "post",
                data: {
                  code: res.code
                },
                success: function (getOpenid) {
                  console.log(getOpenid)
                  wx.request({
                    url: paynumber,
                    method: "post",
                    data: {
                      order_number: ajaxData.order_number,
                      // order_number:"152766159910249123",
                      payment_type_id: ajaxData.payment_type_id,
                      openid: getOpenid.data.data.openid,
                      user_id: wx.getStorageSync("userinfo").userId,
                      // money: ajaxData.payment_price
                      money: 1
                    },
                    success: function (res) {
                      console.log(res)
                      wx.requestPayment({
                        'timeStamp': res.data.data.timeStamp,
                        'nonceStr': res.data.data.nonceStr,
                        'package': res.data.data.package,
                        'signType': 'MD5',
                        'paySign': res.data.data.paySign,
                        'success': function (resPay) {
                          var pay_results = "";
                          // pay_results 1成功, 2失败，3取消 
                          if (res.errMsg == "requestPayment:ok") {
                            pay_results = 1
                            wx.navigateTo({
                              url: '../ordertype/ordertype',
                            })
                          } else if (res.errMsg == "requestPayment:fail cancel") {
                            pay_results = 2
                            wx.showToast({
                              title: '支付失败',
                              icon: "none"
                            })
                          } else if (res.errMsg == "requestPayment:fail (detail message)") {
                            pay_results = 3
                            wx.showToast({
                              title: '支付取消',
                              icon: "none"
                            })
                          }

                          console.log(resPay)
                        },
                        'fail': function (res) {
                        }
                      })

                    },
                    fail: function (res) { 

                    },
                    complete: function () {
                      wx.hideLoading()
                      getDataFlag = false;
                    }
                  })

                },
                fail: function () {

                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })


      }
    
  }

})
