//index.js
//获取应用实例
const app = getApp()
const loginUrl = require("../../config").loginUrl
const wxuser = require("../../config").wxuser
const msg = require('../../config').msg




Page({
  data: {
    hiddenmodalput: false,  //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框 
    getCode: "获取验证码",
    phoneNenber: "",
    yanzhengma: "",
    disabled: false,  // 发送短信的按钮状态
    // showmotai1: false
    
  },
  //事件处理函数
  getUserInfoAction:function(res) {
    console.log(res);
    var that = this;
    // const encryptedData = res.detail.encryptedData;
    // const iv = res.detail.iv;

    var rawData = res.detail.rawData
    var signature = res.detail.signature
    var encryptedData = res.detail.encryptedData //注意是encryptedData不是encryptData...坑啊
    var iv = res.detail.iv

    if (encryptedData && iv) {
      // console.log("允许")
      that.login().then((login) => {        
        const params = {
          "code": login.code,
          "encryptedData": encryptedData,
          "iv": iv,
          "rawData": rawData,
          "signature": signature
        }

        wx.request({    //  请求后台接口得到用户的openId
          url: loginUrl,
          method:'POST',
          data:params,
          success:function(res2){
            console.log(res2)
            var userinfo = {
              userId: res2.data.data.user_id,
              // nickName: res2.data.data.nickName, 
              // avatarUrl: res2.data.data.avatarUrl,
               nickName: res.detail.userInfo.nickName,
               avatarUrl: res.detail.userInfo.avatarUrl,
            }
            wx.setStorageSync("userinfo", userinfo);
            // console.log("userinfo" + JSON.stringify(wx.getStorageInfoSync('userinfo')))
            if (res2.data.code == 2){       
              if (wx.getStorageSync("userinfo")) {
                // console.log("取消隐藏");
                that.setData({ 
                  hiddenmodalput: true
                });
                
              }
            }else{
              userinfo.phone = res2.data.data.user_phone
              wx.setStorageSync("userinfo", userinfo);
              wx.navigateBack({
                delta: 1
              })
            }
            
          }
        })

      }).catch((errMsg) => {
        console.log("登录:" + errMsg)
      })

    } else {
      console.log("拒绝或网络问题")
    }

  },
  login() {
    // 登录
    let promise = new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          if (res.code) {
            resolve(res)
          } else {
            tips.showToast("登录失败", "none")
          }
        },
        fail: function (err) {
          reject(err)
        }
      })

    })
    return promise;
  },
  onLoad: function () {
    
  },
  phoneNenber: function (e) {  // 获取绑定手机号准备接收验证码
    this.setData({
      phoneNenber: e.detail.value
    })
  },
  yanzhengma: function (e) {  // 获取绑定手机号接收的验证码
    this.setData({
      yanzhengma: e.detail.value
    })
  },
  getCodeBut: function () { //  点击获取验证码按钮
    var then = this
    var wait = 60;
    function time() {
      if (wait == 0) {
        then.setData({
          getCode: "再次发送验证码",
          disabled: false
        })
        wait = 60;
      } else {
        then.setData({
          getCode: "重新发送(" + wait + ")",
          disabled: true
        })
        wait--;
        setTimeout(function () {
          time()
        }, 1000)
      }
    }
    time()

    // console.log(then.data.phoneNenber)

    //  发送验证码接口调取
    wx.request({
      url: msg, //仅为示例，并非真实的接口地址
      data: { user_phone: then.data.phoneNenber },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })

  },
  cancel: function () {  //    绑定手机号弹框取消按钮  
    this.setData({
      hiddenmodalput: true
    });

    if (wx.getStorageSync("userinfo").phone) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      console.log("canle")
      wx.navigateTo({  //  若没登录跳转登录
        url: '../home/home'
      })
    }


   
    // wx.navigateBack({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
    //   url: "../home/home"
    // })
  },
  confirm: function () { //   绑定手机号弹框确认按钮 
    var then = this
    var userId = wx.getStorageSync("userinfo").userId
    var dataJson = {
        user_phone: then.data.phoneNenber,
        user_id: userId,
        verification: then.data.yanzhengma
      }
    wx.request({
      url: wxuser,
      data: JSON.stringify(dataJson),
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.code == 1){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
          var userinfo1 = wx.getStorageSync("userinfo")
          var userinfo = {
            userId: userinfo1.userId,
            nickName: userinfo1.nickName,
            avatarUrl: userinfo1.avatarUrl,
            phone: then.data.phoneNenber
          }
          wx.setStorageSync("userinfo", userinfo);
            wx.navigateBack({
              delta: 1
            })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
      }
    })


    this.setData({
      hiddenmodalput: true
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  

  // getCode: function(){
  
  // }
})
