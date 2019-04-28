// pages/my/user/userInfo/userInfo.js
const ren_uploadimg = require('../../config').ren_uploadimg
const paymentRecognize = require('../../config').paymentRecognize
const paymentshow = require("../../config").paymentshow

var paymentIf = require("../../config").paymentIf

// 上传图片
function upload(page, path,i) {
  wx.showLoading({
    title: '加载中',
  })
  wx.uploadFile({
    url: ren_uploadimg,
    filePath: path,
    name: 'file',
    success: function (res) {
      var data = JSON.parse(res.data)
      if (data.code == '200') {
        var keyStr = 'upImgs[' + i + '].imageList1';
        var imageList = "imageList"+i
        page.setData({  //上传成功修改显示头像
          [keyStr]: path,
          [imageList]:data.data
        })
      }

    },
    fail: function (e) {
      wx.showModal({
        title: '提示',
        content: '上传失败',
        showCancel: false
      })
    },
    complete:function(){
      wx.hideLoading()
    }
    
  })
}

var app = getApp();
Page({
  data: {
    upImgs:[
      {
        text: '上传身份证正面照片',
        imageList1:'',
        index:'0',
        imgUrl:"../../images/shenfenzhengzheng.jpg"
      },
      {
        text: '上传身份证反面照片',
        imageList1: '',
        index: '1',
        imgUrl: "../../images/shenfenzhengfan.jpg"
      },
      {
        text: '手持身份证对比图',
        imageList1: '',
        index: '2',
        imgUrl: "../../images/shouchisenfenzheng.jpg"
      }
    ],
    user_name:"",
    id_number: "",    
    imageList0: '',
    imageList1: '',
    imageList2: '',
    userId:"",
    renzhengok:""
  },
  phone1: function (e) {
    this.setData({
      user_name: e.detail.value
    })
  },    // 姓名
  phone2: function (e) {
    this.setData({
      id_number: e.detail.value
    })
  },   // 身份号
  onLoad: function(){
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
    wx.showLoading({
      title: '加载中',
    })
    wx.request({    // 选择获取认证照片
      url: paymentshow,
      data: {
        user_id: this.data.userId
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data.sd_facade_card)
        var keyStr0 = 'upImgs[0].imageList1';
        var keyStr1 = 'upImgs[1].imageList1';
        var keyStr2 = 'upImgs[2].imageList1';
        // var imageList = "imageList" + i
        that.setData({  //上传成功修改显示头像
          [keyStr0]: res.data.data.sd_facade_card,
          [keyStr1]: res.data.data.sd_handheld_card,
          [keyStr2]: res.data.data.sd_identity_card,
          user_name: res.data.data.user_name,
          id_number: res.data.data.id_number,
          imageList0: res.data.data.sd_facade_card,
          imageList1: res.data.data.sd_handheld_card,
          imageList2: res.data.data.sd_identity_card,
        })
      },
      complete:function(){
        wx.hideLoading()
      }
    })
    wx.request({
      url: paymentIf,
      data: {
        user_id: wx.getStorageSync("userinfo").userId,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.code)
        if (res.data.code != 2){
          wx.showToast({
            title: res.data.msg,
            duration:3000,
            icon:"none"
          })
        }
        that.setData({
          renzhengok: res.data.code
        })
        console.log(that.data.renzhengok)
      }
    })


  },
  previewImage:function(e){  //   点击预览图片功能
    
      var current = e.target.dataset.src;
      var arrCurrent = [];
      arrCurrent.push(current)
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: arrCurrent // 需要预览的图片http链接列表  
      })
     
  },

  chooseImage1: function (e) {  //  点击上传图片功能按钮
    var that = this;
    if (that.data.renzhengok == 2 || that.data.renzhengok == 4){
      var i = e.currentTarget.dataset.e;
      wx.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          upload(that, tempFilePaths[0], i);
        }
      })
    }
  },
  default: function(){ 
    
    if (this.data.user_name == undefined || this.data.user_name == ""){
      wx.showToast({
        title: '姓名不能为空',
        icon:"none"
      })
      return false;
    } //姓名验证

    if (!app.isCardNo(this.data.id_number)) {
      return false;
    }  //  身份证验证

    if (this.data.imageList0 == undefined || this.data.imageList0 == "") {
      wx.showToast({
        title: '证件正面图片为空',
        icon: "none"
      })
      return false;
    }  //  证件正面图片验证

    if (this.data.imageList1 == undefined || this.data.imageList1 == "") {
      wx.showToast({
        title: '证件反面图片为空',
        icon: "none"
      })
      return false;
    }  //  证件反面图片验证

    if (this.data.imageList2 == undefined || this.data.imageList2 == "") {
      wx.showToast({
        title: '手持证件图片为空',
        icon: "none"
      })
      return false;
    }  //  手持证件图片验证

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: paymentRecognize,
      data: {
        user_id: this.data.userId,
        id_number: this.data.id_number,
        user_name: this.data.user_name,
        sd_facade_card: this.data.imageList0,
        sd_identity_card: this.data.imageList1,
        sd_handheld_card: this.data.imageList2
      },
      method: 'POST',
      success: function(res) {
        var str = res.data.code
        wx.showToast({
          title: res.data.msg,
        })
        if(res.data.code == 1){
          wx.redirectTo({
            url: '../center/center',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  }
})





