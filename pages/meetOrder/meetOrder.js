// pages/meetOrder/meetOrder.js
// const CountDown = require('../../../../utils/common.js')
var swidth = wx.getSystemInfoSync().windowWidth   // 获取当前窗口的宽度
var sheight = wx.getSystemInfoSync().windowHeight
var orderStatus = require("../../config").orderStatus
var orderCancel = require("../../config").orderCancel
var user = require("../../config").user
var interva2, interval

Page({
  data: {
    hiddenmodalput:false,
    hiddenmodalput1:true,
    hiddenmodalput2:true,
    orderNumber:"",
    staffPhone:"",  ///    接单人电话
    staffUser:"",     //  接单人姓名
    countDownMinute: 10,  //  分
    countDownSecond: 0,  // 秒
  },
  //  倒计时事件处理函数
  countDown: function () {
    var totalSecond = 600;

    interva2 = setInterval(function () {
      // 秒数  
      var second = totalSecond;

      // 分钟位  
      var min = Math.floor(second / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval); 
        clearInterval(interva2);
        // 计时器跑完

        this.setData({
          countDownMinute: '00',
          countDownSecond: '00',
          hiddenmodalput: true,
          hiddenmodalput1:false
        });
        
      }
    }.bind(this), 1000);
  },
  cancel: function () {  //  取消订单按钮
  var than = this
  wx.showLoading({
    title: '加载中',
  })

    //   调用取消订单的接口
    wx.request({
      url: orderCancel,
      method:"POST",
      data: {
        order_number: than.data.orderNumber
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == "1"){
          clearInterval(interval);
          clearInterval(interva2);
          wx.redirectTo({
            url: "../placeOrder/placeOrder"
          })
          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })  
  },
  cance2:function(){    //   再次发起按钮
    // console.log("再次发起")
    var then = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: user,
      method: "POST",
      data: {
        order_number: then.data.orderNumber
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        console.log(res.data.code)
        if (res.data.code == "1") {
          then.setData({
            hiddenmodalput2:false,
            hiddenmodalput1:true,
            hiddenmodalput: true,
            staffPhone: res.data.data.service_phone,
            staffUser: res.data.data.service_name,            
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      },
      complete:function () {
        wx.hideLoading()
      }
    })

  },
  confirm: function () {
    console.log("联系客服")
    wx.makePhoneCall({
      phoneNumber: '4008202222', //此号码并非真实电话号码，仅用于测试  
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  quzhifu:function(){    ////  去支付按钮
  var then = this
    wx.navigateTo({
      url: '../payoff/payoff?number=' + then.data.orderNumber,
    })
  },
  onLoad: function (options) {
    var than = this;

    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })

    this.countDown()
    this.setData({
      orderNumber: options.number,
      lon: options.lon,
      lat: options.lat
    })


    //   获取接单状态
    function setOrderType(){
      var totalSecond = 600;

      interval = setInterval(function () {
        wx.request({
          url: orderStatus,
          data: {
            order_number: options.number
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res)
            if(res.data.code == "200"){
              clearInterval(interval); 
              clearInterval(interva2);
              than.setData({
                staffPhone: res.data.data.service_phone,
                staffUser: res.data.data.service_name,
                hiddenmodalput:true,
                hiddenmodalput2: false
              })

            }

          }
        })
       
        totalSecond -= 5;
        if (totalSecond < 0) {
          clearInterval(interval);
          clearInterval(interva2);
          // 计时器跑完  
        }
      }.bind(this), 5000);
    }

    //  请求开始
    setOrderType()

  },
  onHide: function () {
    console.log("退出页面")
    clearInterval(interval);
    clearInterval(interva2);
  }
})