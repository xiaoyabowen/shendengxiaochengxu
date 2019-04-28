// 引用接口
const addressUpdate = require('../../config').addressUpdate
// 地址详情
const addressShow = require('../../config').addressShow

// pages/revise/revise.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');   // 引用地图
var CusBase64 = require('../../utils/base64.js'); //引用base64加密
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: '7AHBZ-Q4ME6-WBRSD-E5N4U-6M23Z-N3BOL'
});

var app = getApp()
var ajaxData = {
  "user_id": wx.getStorageSync("userinfo").userId
}
Page({
  data: {
    namu:"",//姓名
    input2Type: false,
    lianxi1:"",
    lianxi2:"",
    sex: "1",
    userid:"",
    currentTab: 0,//默认选项卡
  // 用户id
    user_id: "1",
    detailedAddress1: "点击选中地址",
    detailedAddress2: "点击选中地址",
    detailedAddress3: "点击选中地址",
    xiangqing1:"",
    xiangqing2: "",
    xiangqing3: ""
  },
  nameVal: (e) => ajaxData.user_name = e.detail.value,   // 存储联系人姓名
  phone1: (e) => ajaxData.user_phone = e.detail.value,   // 存储联系方式1
  phone2: (e) => ajaxData.user_phone_two = e.detail.value,   // 存储联系方式2
  address1: (e) => ajaxData.take_street = e.detail.value,   // 存储取卡详细地址
  address2: (e) => ajaxData.hospital_address_info = e.detail.value,   // 存储医院详细地址
  address3: (e) => ajaxData.eval_info = e.detail.value,   // 存储送达详细地址
  // 用户名input
  inputname: function(e){
    this.setData({
      namu: e.detail.value
    })
    console.log(this.data.namu)
  },
  // 联系人input
  inputphone: function (e) {
    this.setData({
      lianxi1: e.detail.value
    })
    console.log(this.data.namu)
  },

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
    ajaxData.sex = that.data.sex;
  },
  // 取卡详细地址
  takeAddress: function (e) {
    this.setData({
      address1: e.detail.value
    })
    console.log(this.data.address1)
  },
  // 医院详细地址
  hospitalAddress: function (e) {
    this.setData({
      address2: e.detail.value
    })
    console.log(this.data.address2)
  },
  // 送达地址
  evalAdresss: function (e) {
    this.setData({
      address3: e.detail.value
    })
    console.log(this.data.address3)
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
  
  default:function(e){
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    console.log(ajaxData)
    for (var kay in ajaxData) {
      if (ajaxData[kay] == "" && kay != "user_phone_two" && kay != "user_phone" && ajaxData[kay] != 0) {
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
      } else if (kay == "user_phone") {
        if (ajaxData[kay] == "") {
          wx.showToast({
            title: "手机号不能为空",
            icon: "none"
          })
          return false;
        } else if (!myreg.test(ajaxData[kay])) {
          wx.showToast({
            title: "手机号格式不正确!",
            icon: "none"
          })
          return false;
        }
      } else if (kay == "user_phone_two") {
        console.log(ajaxData[kay]);
        if (ajaxData[kay] != null && !myreg.test(ajaxData[kay])) {
          console.log(888888888)
          wx.showToast({
            title: "手机号格式不正确",
            icon: "none"
          })
          return false;
        }
      }

    }
    //  地址修改  点击保存按钮接口
    wx.showLoading({
      title: '加载中',
    })
    console.log(ajaxData)
    // console.log(this.data.addressid)
    wx.request({
      url: addressUpdate,
      data: JSON.stringify(ajaxData),
      method: 'POST',
      success: function (edit) {
        console.log(edit.data)
        if (edit.data.code == 1 || edit.data.code == -999) {
          wx.showToast({
            title: '编辑成功',
            icon: 'succes',
            duration: 2000,
            mask: true
          })
          wx.navigateBack({//跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
            url: '../useraddress/useraddress'
          })
        } else {
          wx.showToast({
            title: '请填写完成信息',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          return false;
        }
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })

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
            ajaxData.collect_info_address = res.name      //  存储取送达地址地图地址
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
  },
  onLoad: function (edits) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    // console.log(that)
    that.setData({
      userid: edits.addressid
    })
    // console.log(this.data.userid)
    var ajaxData2 = {"address_id": that.data.userid}
    // 地址详情展示
    wx.request({
      url: addressShow,
      data:JSON.stringify(ajaxData2),
      method: 'POST',
      success: function (detail) {
        // console.log(detail)
        console.log(detail.data.data)
        var dataObj = detail.data.data;
        ajaxData = dataObj
        that.setData({
          detailedAddress1: dataObj.take_info_address,
          detailedAddress2: dataObj.hospital_info_address,
          detailedAddress3: dataObj.collect_info_address,
          namu: dataObj.user_name,
          lianxi1: dataObj.user_phone,
          lianxi2: dataObj.user_phone_two,
          xiangqing1: dataObj.take_street,
          xiangqing2: dataObj.hospital_address_info,
          xiangqing3: dataObj.eval_info,
          sex: dataObj.sex
        })
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })


  },
})