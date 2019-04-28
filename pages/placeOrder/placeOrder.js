// pages/placeOrder/placeOrder.js

var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');   // 引用地图
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: '7AHBZ-Q4ME6-WBRSD-E5N4U-6M23Z-N3BOL'
});


// 引用接口
const addressShow = require('../../config').addressShow
var orderInsert = require("../../config").orderInsert
const addressIndex = require("../../config").addressIndex
var util = require('../../utils/util.js');
var user_id = ""
// var date = new Date;

// // var data2 =
// var year = date.getFullYear();
// var month = date.getMonth() + 1;
// month = (month < 10 ? "0" + month : month);
// var day = date.getDate()
// var mydate = (year.toString() + '-' + month.toString() + '-' + day);


function GetDateStr(AddDayCount) {
       var dd = new Date();
       dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
      var y = dd.getFullYear();
       var m = dd.getMonth() + 1;//获取当前月份的日期 
       var d = dd.getDate();
     return y + "-" + m + "-" + d;
  
} 

var mydate = GetDateStr(0);
var enddate = GetDateStr(7);



var ajaxData = { 
  sex: "1",
  pre_time:"",
  order_user_name:"",
  order_user_phone: "",
  order_user_phone_two: "",
  order_take_street: "",
  order_collect_street: "",
  order_address_hospital: "",
}


var app = getApp()
Page({
  data: {
    date: mydate,  // 预约日期时间
    endData: enddate,
    input2Type: false,
    currentTab: 0,   // tab切换  
    detailedAddress1: "(必选)点击选中地址",
    detailedAddress2: "(必选)点击选中地址",
    detailedAddress3: "(必选)点击选中地址",
    xiangqing1: "",
    xiangqing2: "",
    xiangqing3: "",
    sex:"1",
    news:"",
    namu:"",//姓名
    lianxi1:"",//第一个联系方式
    // 导入时进行储存
    daoru:"",
    newsev:""
  },
  onLoad: function () {
    
    
    var that = this;
    that.setData({
      news: util.formatTime2(new Date())
      
    })
    if (wx.getStorageSync("userinfo").phone) {
      user_id = wx.getStorageSync("userinfo").userId
    }else{
      wx.navigateTo({  //  若没登录跳转登录
        url: '../login/login'
      })
    }
    that.daoruFn();

  },

  daoruFn: function() {
    var that = this;
    wx.getStorage({
      //获取数据的key
      key: 'key',
      success: function (res) {
        that.setData({
          daoru: res.data
        })

        if (that.data.daoru !== "") {
          var ajaxData1 = {"user_id": user_id}
          wx.request({
            url: addressIndex,
            data: JSON.stringify(ajaxData1),
            method: 'POST',
            success: function (res) {
              console.log(res)
              var data = res.data.data[that.data.daoru];
              console.log(data)
              ajaxData.hospital_lng = data.hospital_lng
              ajaxData.hospital_lat = data.hospital_lat
              ajaxData.collect_lng = data.collect_lng
              ajaxData.collect_lat = data.collect_lat
              ajaxData.take_lng = data.take_lng
              ajaxData.take_lat = data.take_lat
              ajaxData.order_user_id = data.user_id
              ajaxData.order_user_name = data.user_name
              ajaxData.order_user_phone = data.user_phone
              ajaxData.order_user_phone_two = data.user_phone_two
              // ajaxData.pre_time = mydate
              ajaxData.order_take_province = data.take_pro
              ajaxData.order_take_city = data.take_city
              ajaxData.order_take_area = data.take_area
              ajaxData.order_take_street = data.take_street
              ajaxData.order_collect_province = data.eval_pro
              ajaxData.order_collect_city = data.eval_city
              ajaxData.order_collect_area = data.eval_area
              ajaxData.order_collect_street = data.eval_info
              ajaxData.order_address_hospital_pro = data.hospital_pro
              ajaxData.order_address_hospital_city = data.hospital_city
              ajaxData.order_address_hospital_area = data.hospital_area
              ajaxData.order_address_hospital = data.hospital_address_info
              ajaxData.take_info_address = data.take_info_address
              ajaxData.hospital_info_address = data.hospital_info_address
              ajaxData.collect_info_address = data.collect_info_address
              ajaxData.sex = data.sex

              that.setData({
                namu:data.user_name,
                lianxi1: data.user_phone,
                lianxi2: data.user_phone_two ? data.user_phone_two:"",
                detailedAddress1: data.take_info_address,
                detailedAddress2: data.hospital_info_address,
                detailedAddress3: data.collect_info_address,
                xiangqing1: data.take_street,
                xiangqing2: data.hospital_address_info,
                xiangqing3: data.eval_info,
                sex:data.sex
              })
            }
          })
        }
      },
      fail: function (res) {
       
      }
    })
    
  },
  nameVal: (e) => ajaxData.order_user_name =e.detail.value,   // 存储联系人姓名
  phone1: (e) => ajaxData.order_user_phone = e.detail.value,   // 存储联系方式1
  phone2: (e) => ajaxData.order_user_phone_two = e.detail.value,   // 存储联系方式2
  address1: (e) => ajaxData.order_take_street = e.detail.value,   // 存储取卡详细地址
  address2: (e) => ajaxData.order_collect_street = e.detail.value,   // 存储医院详细地址
  address3: (e) => ajaxData.order_address_hospital = e.detail.value,   // 存储送达详细地址
  
  bindDateChange: function (e) {  //  点击日期插件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // this.setData({
    //   data: e.detail.value
    // })
    ajaxData.pre_time = e.detail.value
  },
  sexSelect: function (e) {  //  选择男女
    var that = this;
    var six = e.currentTarget.dataset.type
    ajaxData.sex = six
    if (six == 1) {
      that.setData({
        sex: "1"
      })
    } else if (six == 2) {
      that.setData({
        sex: "2"
      })
    }
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
  default:function(){
    var that = this

    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

    if (wx.getStorageSync("userinfo")) {  //  判断用户是否登录
      ajaxData.order_user_id = wx.getStorageSync("userinfo").userId // 存储用户ID
      
      
      console.log(ajaxData)
      for(var kay in ajaxData){
        if (ajaxData[kay] == "" && kay != "order_user_phone_two" && kay != "order_user_phone") {
          console.log(kay)
          switch (kay) {
            case 'order_user_name':
              wx.showToast({
                title: "请填写联系人姓名",
                icon: "none"
                // image:"../../images/all.png"
              })
              break;
            case 'pre_time':
              wx.showToast({
                title: "请确认下单日期",
                icon: "none"
              })
              break;

            case 'order_take_street':
              wx.showToast({
                title: "请填写详细取卡地址",
                icon: "none"
              })
              break;
            case 'order_address_hospital':
              wx.showToast({
                title: "请填写详细医院地址",
                icon: "none"
              })
              break;
            case 'order_collect_street':
              wx.showToast({
                title: "请填写详细送达地址",
                icon: "none"
              })
              break;
          }
          return false;
        } else if (kay == "order_user_phone") {
          if (ajaxData[kay] == "") {
            wx.showToast({
              title: "请填写手机号",
              icon: "none"
            })
            return false;
          } else if (!myreg.test(ajaxData[kay])) {
            wx.showToast({
              title: "手机号1格式不正确",
              icon: "none"
            })
            return false;
          }
        } else if (kay == "order_user_phone_two") {
          console.log(ajaxData[kay])
          console.log(!myreg.test(ajaxData[kay]))
          if (ajaxData[kay] && !myreg.test(ajaxData[kay])) {
            wx.showToast({
              title: "手机号2格式不正确",
              icon: "none"
            })
            return false;
          }
        }

      }
     
      wx.request({
        url: orderInsert,
        data: ajaxData,
        method:"POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)


          if (res.data.code=="1"){
            wx.redirectTo({
              url: "../meetOrder/meetOrder?lng=" + ajaxData.take_lng + "&lat=" + ajaxData.take_lat + "&number=" + res.data.data
            })
            //  清空缓存key
            wx.removeStorage({
              key: 'key',
              success: function (res) {
                console.log(res.data)
              }
            })

            for (var k in ajaxData){
              ajaxData[k] = ""
            }
            
          }else{
            wx.redirectTo({
              title: res.data.msg
            })
          }
        }
      })
    }else{
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
            ajaxData.order_take_province = addressRes.result.address_component.province    //  存储取卡地址省
            ajaxData.order_take_city = addressRes.result.address_component.city     //  存储取卡地址市
            ajaxData.order_take_area = addressRes.result.address_component.district     //  存储取卡地址区
            ajaxData.take_info_address = res.name     //  存储取卡地址
            ajaxData.take_lng = res.longitude     //  存储取卡地址市经度
            ajaxData.take_lat = res.latitude     //  存储取卡地址市纬度
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
            console.log(addressRes)
            ajaxData.order_address_hospital_pro = addressRes.result.address_component.province    //  存储取卡地址省
            ajaxData.order_address_hospital_city = addressRes.result.address_component.city     //  存储取卡地址市
            ajaxData.order_address_hospital_area = addressRes.result.address_component.district     //  存储取卡地址区
            ajaxData.hospital_info_address = res.name     //  存储取卡地址
            ajaxData.hospital_lng = res.longitude     //  存储取卡地址市经度
            ajaxData.hospital_lat = res.latitude     //  存储取卡地址市纬度
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
console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            // console.log(addressRes)
            ajaxData.order_collect_province = addressRes.result.address_component.province    //  存储取卡地址省
            ajaxData.order_collect_city = addressRes.result.address_component.city     //  存储取卡地址市
            ajaxData.order_collect_area = addressRes.result.address_component.district     //  存储取卡地址区
            ajaxData.collect_info_address = res.name    //  存储取卡地址
            ajaxData.collect_lng = res.longitude     //  存储收货地址市经度
            ajaxData.collect_lat = res.latitude     //  存储收货地址市纬度
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
  // 点击导入   获取地址
  start: function(){
    wx.redirectTo({
      url: '../leadingin/leadingin',
    })
  }
})









