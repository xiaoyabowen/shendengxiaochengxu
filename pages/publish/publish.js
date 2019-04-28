const review = require('../../config').review
const uploadimg = require('../../config').uploadimg

var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
// pages/publish/publish.js


function upload(page, path) {
  
    wx.uploadFile({
      url: uploadimg,
      filePath: path,
      name: 'file',
      success: function (res) {
        console.log(res);
        var data = JSON.parse(res.data)
        console.log(JSON.parse(res.data))
        if (data.code == '200'){
          var imageList = page.data.imageList
          imageList.push(path)
          var imgobj = page.data.imgobj
          imgobj.push(data.data)

          page.setData({  //上传成功修改显示头像
            imageList: imageList,
            imgobj: imgobj
          })
        }
        
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      }
    })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordernum:"",
    // 拍照
    imageList: [],  //本地 图片路径
    imgobj:[],  //  返回的图片
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    // 星星
    flag:5,
    star_gray:"../../images/star_gray3x.png",
    star_ora: "../../images/star_ora3x.png",
    // 输入框
    reason_input: ""
  },
  // 拍照事件
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length;i++){
          upload(that, tempFilePaths[i]);
        }
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  // 点击星星评分
  changeColor11: function () {
    var that = this;
    console.log(1)
    that.setData({
      flag: 1
    });
  },
  changeColor12: function () {
    var that = this;

    console.log(2)
    that.setData({
      flag: 2
    });
  },
  changeColor13: function () {
    var that = this;

    console.log(3)
    that.setData({
      flag: 3
    });
  },
  changeColor14: function () {
    var that = this;

    console.log(4)
    that.setData({
      flag: 4
    });
  },
  changeColor15: function () {
    var that = this;

    console.log(5)
    that.setData({
      
      flag: 5
    });
  },
  // 文本框输入的 信息
  bindtext: function (e) {
    this.setData({
      reason_input: e.detail.value
    })
  },
  submit: function(){
    wx.showLoading({
      title: '加载中',
    })
    
    wx.request({
      url: review,
      data: {
        order_number: this.data.ordernum,
        comment_content: this.data.reason_input,
        comment_type_id: this.data.flag,
        comment_img: this.data.imgobj
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
      },complete: function (res) {
        wx.hideLoading()
      },

    })
    wx.navigateTo({
      url: "../discuss/discuss"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      ordernum: options.number
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