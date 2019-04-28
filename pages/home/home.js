// pages/home/home.js
const show = require("../../config").show 

var app = getApp()


var swidth = wx.getSystemInfoSync().windowWidth   // 获取当前窗口的宽度
var sheight = wx.getSystemInfoSync().windowHeight

Page({
  data: {
    latitude: '',
    longitude: '',
    scale: '13',
    markers: [],
    controls: [{
      id: 1,
      iconPath: '../../images/lib/icon/dingwei-icon.png',
      position: {
        left: swidth - 65,
        top: sheight - 200,
        width: 50,
        height: 50
      },
      clickable: true
    },
    {
      id: 2,
      iconPath: '../../images/lib/icon/jia-icon.png',
      position: {
        left: swidth - 60,
        top: sheight - 316,
        width: 40,
        height: 48
      },
      clickable: true
    },
    {
      id: 3,
      iconPath: '../../images/lib/icon/jian-icon.png',
      position: {
        left: swidth - 60,
        top: sheight - 270,
        width: 40,
        height: 48
      },
      clickable: true
    },
    {
      id: 4,
      iconPath: '../../images/dianhua.png',
      position: {
        left: -10,
        top: sheight - 130,
        width: 100,
        height: 63
      },
      clickable: true
    },
    {
      id: 5,
      iconPath: '../../images/gerenzhongxin.png',
      position: {
        left: swidth-90,
        top: sheight - 130,
        width: 100,
        height: 63
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    var id = e.controlId;
    if (id == 1) {
      /**
      * 地图定位功能
      */
      var then = this

      then.setData({
        
        scale: '13',
      })

      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          console.log(res)
          then.setData({
            latitude: latitude,
            longitude: longitude
          })
        },
        complete: function () {
          
        }
      })
    } else if (id == 2) {
      var naber = this.data.scale; //获取地图缩放倍数 
      if (naber < 20) {
        naber++
      } else {
        naber = 20;
      }

      this.setData({
        scale: naber,
      })
    } else if (id == 3) {
      var naber = this.data.scale; //获取地图缩放倍数 

      if (naber > 5) {
        naber--
      } else {
        naber = 5;
      }
      this.setData({
        scale: naber,
      })
    } else if (id == 4){
      wx.makePhoneCall({
        phoneNumber: '4008209595',
      })
    } else if (id == 5){
      wx.navigateTo({
        url: '../center/center'
      })
    }


    // console.log(e.controlId)
  },
  /**
   * 地图放大功能
   */
  mapOn: function () {
    console.log("我点击了地图")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var then = this
    //  定位获取设备位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(res)
        then.setData({
          latitude: latitude,
          longitude: longitude
        })
      },
      complete: function () {
        
      }
    })

    function dingwi(){
      wx.request({
        url: show, //仅为示例，并非真实的接口地址
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 1) {
            var arr0 = [];
            for (var i = 0; i < res.data.data.length; i++) {
              let obj = {
                iconPath: "../../images/qishou_icon.png",
                id: res.data.data[i].service_number,
                latitude: res.data.data[i].lat,
                longitude: res.data.data[i].lng,
                width: 35,
                height: 35
              }
              arr0.push(obj)
            }
            then.setData({
              markers: arr0
            })
          }

        }
      })
    }
    setInterval(dingwi,5000)
    

  }

})