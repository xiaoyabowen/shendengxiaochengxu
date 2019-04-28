// pages/placeOrder/placeOrder.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');   // 引用地图



var qqmapsdk;

qqmapsdk = new QQMapWX({
  key: '7AHBZ-Q4ME6-WBRSD-E5N4U-6M23Z-N3BOL'
});

function tobase64(obj){
  var base64 = obj; 
  for(var i=0; i<3; i++){
    base64 = CusBase64.CusBASE64.encoder(base64)
    console.log(CusBase64.CusBASE64.decoder(base64))
  }
  return base64
}

// 引用接口
const addressShow = require('../../config').addressShow
var orderInsert = require("../../config").orderInsert
// const addressIndex = require("../../config").addressIndex
const addressInsert = require("../../config").addressInsert

// var date = new Date;
// var year = date.getFullYear();
// var month = date.getMonth() + 1;
// month = (month < 10 ? "0" + month : month);
// var day = date.getDate()
// var mydate = (year.toString() + '-' + month.toString() + '-' + day);

// console.log(ajaxData)
var ajaxData = {
  user_name: "",
  user_phone: "",
  user_phone_two: "",
  take_street: "",
  eval_info: "",
  hospital_address_info: "",
  sex:"1"
}


var app = getApp()
Page({
  data: {
    // date: mydate,  // 预约日期时间
    input2Type: false,
    sex: "1",
    detailedAddress1: "点击选中地址",
    detailedAddress2: "点击选中地址",
    detailedAddress3: "点击选中地址",
    currentTab: 0,//默认选项卡
    namu: "",//姓名
    lianxi1: "",//第一个联系方式
    // 导入时进行储存
    daoru: ""
  },
  onLoad: function () {
    var that = this;
  },
  nameVal: (e) => ajaxData.user_name = e.detail.value,   // 存储联系人姓名
  phone1: (e) => ajaxData.user_phone = e.detail.value,   // 存储联系方式1
  phone2: (e) => ajaxData.user_phone_two = e.detail.value,   // 存储联系方式2
  address1: (e) => ajaxData.take_street = e.detail.value,   // 存储取卡详细地址
  address2: (e) => ajaxData.hospital_address_info = e.detail.value,   // 存储医院详细地址
  address3: (e) => ajaxData.eval_info = e.detail.value,   // 存储送达详细地址

  // bindDateChange: function (e) {  //  点击日期插件
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },
  sexSelect: function (e) {  //  选择男女
    var that = this;
    var six = e.currentTarget.dataset.type
    if (six == 1) {
      that.setData({
        sex: "1"
      })

    } else if (six == 2) {
      that.setData({
        sex: "2"
      })

    }
    ajaxData.sex = that.data.sex
  },
  addInput2: function () {  //  增加第二个联系方式
    this.setData({
      input2Type: true
    })
  },
  sudInput2: function () {   //  删除第二个联系方式
    this.setData({
      input2Type: false
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  default: function () {
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var that = this;
    console.log(ajaxData);
    if (wx.getStorageSync("userinfo")) {  //  判断用户是否登录

      ajaxData.user_id = wx.getStorageSync("userinfo").userId // 存储用户ID

      console.log(ajaxData)

      for (var kay in ajaxData) {
        if (ajaxData[kay] == "" && kay != "user_phone_two" && kay != "user_phone") {
          console.log(kay)
          switch (kay) {
            case 'user_name':
              wx.showToast({
                title: "联系人不能空",
                icon: "none"
                // image:"../../images/all.png"
              })
              break;
            case 'take_street':
              wx.showToast({
                title: "取卡地址不能空",
                icon: "none"
              })
              break;
            case 'hospital_address_info':
              wx.showToast({
                title: "医院地址不能空",
                icon: "none"
              })
              break;
            case 'eval_info':
              wx.showToast({
                title: "送达地址不能空",
                icon: "none"
              })
              break;
          }
          return false;
        } else if (kay == "user_phone"){
          if (ajaxData[kay] == ""){
            wx.showToast({
              title: "手机号不能为空",
              icon: "none"
            })
            return false;
          }else if(!myreg.test(ajaxData[kay])){
            wx.showToast({
              title: "手机号格式不正确!",
              icon: "none"
            })
            return false;
          }
        } else if (kay == "user_phone_two"){
          if (ajaxData[kay] != "" && !myreg.test(ajaxData[kay])) {
            wx.showToast({
              title: "手机号格式不正确",
              icon: "none"
            })
            return false;
          }
        } 
         
      }
      wx.showLoading({
        title: '加载中',
      })
      console.log(ajaxData);
      
      wx.request({
        url: addressInsert,
        data:JSON.stringify(ajaxData),
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          for (var key in ajaxData){
            ajaxData[key]=""
          }

          wx.redirectTo({
            url: '../useraddress/useraddress'
          })
        },
        complete: function (res) {
          wx.hideLoading()
        },
      })
    } else {
      wx.navigateTo({  //  若没登录跳转登录
        url: '../login/login'
      })
    }
  },
  //移动选点取卡地址
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            ajaxData.take_pro = addressRes.result.address_component.province    //  存储取卡地址省
            ajaxData.take_city = addressRes.result.address_component.city     //  存储取卡地址市
            ajaxData.take_area = addressRes.result.address_component.district     //  存储取卡地址区
            ajaxData.take_lng = res.longitude     //  存储取卡地址市经度
            ajaxData.take_lat = res.latitude     //  存储取卡地址市纬度
            ajaxData.take_info_address = res.name     //  存储取卡地址地图地址
          }
        });
        // console.log(res)

        that.setData({
          detailedAddress1: res.name,
        });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  //移动选点医院地址
  moveToLocation2: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            // console.log(addressRes)
            ajaxData.hospital_pro = addressRes.result.address_component.province    //  存储医院地址省
            ajaxData.hospital_city = addressRes.result.address_component.city     //  存储医院地址市
            ajaxData.hospital_area = addressRes.result.address_component.district     //  存储医院地址区
            ajaxData.hospital_lng = res.longitude     //  存储医院地址市经度
            ajaxData.hospital_lat = res.latitude     //  存储医院地址市纬度
            ajaxData.hospital_info_address = res.name     //  存储医院地址地图地址
          }
        });
        // console.log(res)
        that.setData({
          detailedAddress2: res.name,
        });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  //移动选点送达地址
  moveToLocation3: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            // console.log(addressRes)
            ajaxData.eval_pro = addressRes.result.address_component.province    //  存储送达地址省
            ajaxData.eval_city = addressRes.result.address_component.city     //  存储送达地址市
            ajaxData.eval_area = addressRes.result.address_component.district     //  存储送达地址区
            ajaxData.collect_lng = res.longitude     //  存储收货地址市经度
            ajaxData.collect_lat = res.latitude     //  存储收货地址市纬度
            ajaxData.collect_info_address = res.name     //  存储取送达地址地图地址
          }
        });
        // console.log(res)
        that.setData({
          detailedAddress3: res.name,
        });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  }
})









