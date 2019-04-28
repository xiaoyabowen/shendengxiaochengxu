const chargeBill = require('../../config').chargeBill

// pages/historicalBill/historicalBill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    none:"",//没有数据时候的状态
    billBox:[{
      orderNum:"1000",
      orderDate:"2018-12-12",
      orderPrice:"1000",
      orderType:"年付",
      orderMode:"微信",
      orderFlow:"123456788941222"
    }, {
      orderNum: "1000",
      orderDate: "2018-12-12",
      orderPrice: "1000",
      orderType: "年付",
      orderMode: "微信",
      orderFlow: "123456788941222"
      }, {
        orderNum: "100",
        orderDate: "2018-12-12",
        orderPrice: "1000",
        orderType: "年付",
        orderMode: "微信",
        orderFlow: "123456788941222"
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    if (wx.getStorageSync("userinfo")) {
      var userinfo = wx.getStorageSync("userinfo");
      that.setData({
        userId: userinfo.userId
      });
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    wx.request({
      url: chargeBill,
      data: {
        user_id:that.data.userId
        // user_id:98
      },
      method: 'POST',
      success: function(res) {
        var datas = res.data.data;
        console.log(datas);
        if (res.data.code == "1"){
          var his_arr=[];
          for(var i=0;i<datas.length;i++){
            var his_obj = {
              orderNum: datas[i].pay_number,
              orderDate: datas[i].pay_time,
              orderPrice: datas[i].pay_price,
              orderType: datas[i].pay_type,
              orderMode: datas[i].pay_type_info,
              orderFlow: datas[i].pay_number_info,
            }
            his_arr.push(his_obj)
          }
          that.setData({
            billBox: his_arr,
            none: true
          })
        }else{
          that.setData({
            none: false
          })
        }

      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading();
      },
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