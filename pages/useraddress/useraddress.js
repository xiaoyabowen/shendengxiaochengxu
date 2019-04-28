// pages/useraddress/useraddress/useraddress.js

// 引用接口
const addressDele = require('../../config').addressDel
const addressIndex = require('../../config').addressIndex
const addressDefault = require('../../config').addressDefault

var user_id = ""

var app = getApp();
Page({
  data: {
    suoyin:"",
    userAddRess:[],
    hidden: false,
    nocancel: false,
    names :"aaa",
    addStr:[],
    showModalStatus: false,
    hiddenModal: true,
    // 弹框变量
    showModal: false,
    // 地址Id
    addId:"",
    addressIdCom:"",
    user_id:"",
    // 设为默认的索引值
    morensuoyin:"",
    addCheck:true,
  },
  
  // 设为默认点击效果
  toggleMoren: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this; 
    // console.log(that)
    for (var i = 0; i < that.data.userAddRess.length; i++){
      var keyStr2 = "userAddRess[" + i + "].ifDefault"
      // console.log(keyStr2)
      that.setData({
        [keyStr2]: 0     //false
      })
    }  
    var taype1 = that.data.userAddRess[index].ifDefault  //0 1
    // console.log(taype1)
    var keyStr1 = "userAddRess[" + index + "].ifDefault"
    that.setData({
      [keyStr1]: !taype1,//false
    })
    console.log(that.data.userAddRess[index].addressId)
    // 点击设为默认数据接口
    var ajaxData1 = {
      "address_id": that.data.userAddRess[index].addressId,
      "user_id": that.data.user_id
    };
    wx.request({
      url: addressDefault,
      data: JSON.stringify(ajaxData1), 
      method: 'POST',
      success: function (del) {}
    })
  },
  // 点击编辑按钮
  
  editJump: function (e) {
    console.log(e)
    // console.log(e.currentTarget.dataset.addressid)
    var suoyin2 = e.currentTarget.dataset.addressid
    console.log(suoyin2)
    wx.navigateTo({
      url: '../revise/revise?addressid=' + suoyin2
    })

  },

  /**
  * 弹窗*/
  // 点击删除
  showDialogBtn: function (e) {
    var idx = e.currentTarget.dataset.id
    this.setData({
      showModal: true,
      suoyin: idx
    })
    // console.log(this.data.suoyin)
  },
  /*** 弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {
  },
  /*** 隐藏模态对话框*/
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /** * 对话框取消按钮点击事件*/
  onCancel: function () {
    this.hideModal();
  },
  
  /** * 对话框确认按钮点击事件  删除移除数组里面的数据*/
  addressDel: function (e) {
    var that = this
    this.hideModal();
    var suoyin1 = this.data.suoyin
    // console.log(suoyin1)
    var ajaxData2 = {
      "address_id": that.data.userAddRess[suoyin1].addressId
    }
    // 点击删除数据接口
    wx.request({
      url: addressDele,
      data: JSON.stringify(ajaxData2), 
        method: 'POST',
        success: function (del) {
          // console.log(del.data)
          that.data.userAddRess.splice(suoyin1, 1);
          var arruserAddRess = that.data.userAddRess;
          that.setData({
            userAddRess: arruserAddRess
          })
          if (del.data.code == "1"){
            wx.showToast({
              title: '删除成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          }else{
            wx.showToast({
              title: '删除失败',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          }
          
        }
      })
  },
  addressBut:function(){
    wx.navigateTo({
      url: '../addRess/addRess',
    })
  },
  
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    if (wx.getStorageSync("userinfo")) {  //  判断用户是否登录
      this.setData({
        user_id : wx.getStorageSync("userinfo").userId // 存储用户ID
      })
     
      
    } else {
      wx.navigateTo({  //  若没登录跳转登录
        url: '../login/login'
      })
    }
  },
  // 页面展示重新进行页面的数据渲染
  onShow: function(){
    wx.showLoading({
      title: '加载中',
    })
    var then = this;
    // console.log(then.data.user_id)
    var ajaxData = {"user_id": then.data.user_id}
    // console.log(app.tobase64(JSON.stringify(then.data.user_id)))
    wx.request({
      url: addressIndex,
      method: 'POST',
      data: JSON.stringify(ajaxData),
      success: function (res) {
        if (res.data.data.code = "1") {
          var address_arr = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var addressArr = {
              userName: res.data.data[i].user_name,  //姓名
              userPhone: res.data.data[i].user_phone, //手机号
              addressId: res.data.data[i].address_id,  //地址ID
              userId: then.data.user_id,  //用户id
              takePro: res.data.data[i].take_pro,   //取卡  省
              takeCity: res.data.data[i].take_city,   //取卡  市
              takeArea: res.data.data[i].take_area,   //取卡  区
              takeStreet: res.data.data[i].take_street,   //取卡  详细
              sex:res.data.data[i].sex,
              hospitalPro: res.data.data[i].hospital_pro,   //医院  省
              hospitalCity: res.data.data[i].hospital_city,   //医院  市
              hospitalArea: res.data.data[i].hospital_area,   //医院  区
              hospitalAddressInfo: res.data.data[i].hospital_address_info,   //医院  详细

              evalPro: res.data.data[i].eval_pro,   //收货  省
              evalCity: res.data.data[i].eval_city,   //收货  市
              evalArea: res.data.data[i].eval_area,   //收货  区
              evalInfo: res.data.data[i].eval_info,   //收货  详细
              ifDefault: res.data.data[i].if_default,   //是否默认
              ifDel: res.data.data[i].if_del,   //是否删除
            }
            address_arr.push(addressArr)
          }
          then.setData({
            userAddRess: address_arr
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  }
})