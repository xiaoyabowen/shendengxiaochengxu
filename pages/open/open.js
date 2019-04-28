var chargeRenew = require("../../config").chargeRenew
var wxCode = require("../../config").wxCode
var pays = require("../../config").pays
// pages/open/open.js
var getDataFlag = false;
var pay_results = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    // 年付 季付 月付数据
    note:"",
    click_type:"",
    typeTitle:{
      openType:"",
      openPrice:"170"
    },
    id:"",
    userId:""
  },
  submit: function(){
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
    // if (getDataFlag) {
    //   return;
    // }
    // getDataFlag = true;

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
                url: pays,
                method:"post",
                data: {
                  payment_type_id: that.data.id,
                  openid: getOpenid.data.data.openid,
                  user_id: that.data.userId,
                  // money: that.data.typeTitle.openPrice*100
                  money: 1
                },
                success: function(res) {
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp,
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.package,
                    'signType': 'MD5',
                    'paySign': res.data.data.paySign,
                    'success': function (resPay) {

                      // pay_results 1成功, 2失败，3取消 
                      if (res.errMsg == "requestPayment:ok") {
                        pay_results = 1
                      } else if (res.errMsg == "requestPayment:fail cancel") {
                        pay_results = 2
                      } else if (res.errMsg == "requestPayment:fail (detail message)") {
                        pay_results = 3
                      }

                      if (pay_results == 1){
                        wx.request({
                          url: chargeRenew,
                          data: {
                            user_id: that.data.userId,
                            pay_price: that.data.typeTitle.openPrice,
                            pay_type: that.data.typeTitle.openType,
                            pay_type_info: "微信支付",
                            payment_type_id: that.data.id
                          },
                          method: 'POST',
                          success: function (res) {
                            // console.log(res);
                            wx.navigateBack({
                              delta: 1
                            })
                          },
                          fail: function (res) { },
                          complete: function (res) {
                            getDataFlag = false;
                          },
                        })
                      }
                      


                      console.log(resPay)
                    },
                    'fail': function (res) {
                    }
                  })

                },
                fail: function(res) {}
              })
              
            },
            fail: function () {

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });


    


    // 如果当前用户选择的是就餐券  直接支付 
    // wx.login({
    //   success: res => {

    //     if (res.code) {
    //       wx.request({
    //         url: paymentUrl + '/pay/getOpenId',
    //         data: {
    //           code: res.code
    //         }, success: res => {

    //           wx.request({
    //             url: paymentUrl + '/pay/getOrderNo',
    //             data: {
    //               openid: res.data.map.openid,
    //               userid: app.globalData.useId,
    //               price: postPrice,
    //               // price: "0.1",
    //               body: vipDetail
    //             }, success: res => {
    //               var payargs = res.data.map;
    //               this.setData({
    //                 orderNo: payargs.orderNo
    //               })
    //               wx.requestPayment({
    //                 timeStamp: payargs.timeStamp,
    //                 nonceStr: payargs.nonceStr,
    //                 package: payargs.package,
    //                 signType: payargs.signType,
    //                 paySign: payargs.paySign,
    //                 complete: res => {
    //                   // pay_results 1成功2失败，3取消 
    //                   if (res.errMsg == "requestPayment:ok") {
    //                     pay_results = 1
    //                   } else if (res.errMsg == "requestPayment:fail cancel") {
    //                     pay_results = 2
    //                   } else if (res.errMsg == "requestPayment:fail (detail message)") {
    //                     pay_results = 3
    //                   }
    //                   // console.log("identityId" + this.data.setIdentityId)
    //                   // console.log("订单号1" + columnNum)
    //                   // console.log('pay_results====' + pay_results)
    //                   // console.log("useId====" + useId)
    //                   // console.log("postPrice====" + postPrice)
    //                   // console.log("vipDetail====" + vipDetail)
    //                   // console.log("orderNo====" + this.data.orderNo)
    //                   // console.log("columnNum====" + columnNum)
    //                   // console.log("currentTab====" + this.data.currentTab)
    //                   // console.log("num====" + this.data.num)
    //                   wx.request({
    //                     url: paymentUrl + "/pay/wxNotifyUrl",
    //                     method: "POST",
    //                     data: {
    //                       pay_results: pay_results,
    //                       userid: app.globalData.useId,
    //                       price: postPrice,
    //                       identityId: this.data.setIdentityId,
    //                       body: vipDetail,
    //                       orderNo: this.data.orderNo,
    //                       columnNum: columnNum,//总积分
    //                       come: "1",//1礼包 2 商城
    //                       cardClass: this.data.currentTab,//1.就餐券2，商城礼包
    //                       num: this.data.num,
    //                       classify: "1",
    //                       specid: "1"//规格
    //                     }, success: res => {
    //                       // console.log(res);

    //                       if (res.data.code == 1) {
    //                         console.log('支付成功了')
    //                         this.buyOnly();
    //                         wx.showModal({
    //                           title: '提示',
    //                           content: res.data.msg
    //                         })
    //                         app.globalData.identityId = this.data.setIdentityId
    //                       } else {
    //                         wx.showModal({
    //                           title: '提示',
    //                           content: res.data.msg
    //                         })
    //                       }
    //                     }
    //                   })
    //                 }
    //               })
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    // 将获取到的值转为对象输出
    var then = JSON.parse(options.setLogin);
    // console.log(then);
    // 年 季 月
    var opentype = 'typeTitle.openType';
    var openPrice = 'typeTitle.openPrice';
    this.setData({
      type:then.setLogin,
      note: then.note,
      [opentype]: then.click_types,
      [openPrice]: then.price_num,
      id: then._set
    });
    // console.log(this.data.typeTitle.openType);
    // console.log(this.data.typeTitle.openPrice);
    // console.log(this.data.id);
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
    wx.hideLoading();
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