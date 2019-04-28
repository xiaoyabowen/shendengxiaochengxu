const commentlists = require('../../config').commentlists
// pages/discuss/discuss.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    none:false,
    discuss: [
    //{
    //  head_pic: "../../images/head-pic.png",
    //  name: "匿名用户",
    //  discuss_con: "此用户没有填写评论此用户,
    //  discuss_pic: [],
    //}
    ],
    data_img:[
      "https://www.flaxl.cn/headimg/1.png",
      "https://www.flaxl.cn/headimg/2.png",
      "https://www.flaxl.cn/headimg/3.png",
      "https://www.flaxl.cn/headimg/4.png",
      "https://www.flaxl.cn/headimg/5.png",
      "https://www.flaxl.cn/headimg/6.png",
      "https://www.flaxl.cn/headimg/7.png",
      "https://www.flaxl.cn/headimg/8.png",
      
      
    ]
  },
  /**   
     * 预览图片  
     */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var idx = e.target.dataset.index;
    var then = this;
    var urlss = then.data.discuss[idx].discuss_pic;
    var xxx = [];
    for (var i = 0; i < urlss.length; i++){
      xxx.push(urlss[i].comment_img)
    }
    console.log(urlss)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: xxx // 需要预览的图片http链接列表  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.request({
      url: commentlists,
      data:{
        user_id:that.data.userId

      },
      method:'POST',
      success: function(res){
        console.log(res);
        if(res.data.code == "200"){
          var data = res.data.data;
          var discuss_arr = [];
          for (var i = 0; i < data.length; i++) {//for循环 创建数组   拿到的数据放回data里面
          // 获取一个随机
            var sj = Math.floor(Math.random() * that.data.data_img.length);
            var target = {
              head_pic: that.data.data_img[sj],//用户头像    默认无
              name: "匿名用户",//用户昵称   默认是匿名用户
              discuss_con: data[i].comment_content,//用户评论内容
              discuss_pic: data[i].img//用户评论照片
            }
            discuss_arr.push(target)
          }
          that.setData({
            discuss: discuss_arr,
            none:false
          })
        }else{
          that.setData({
            none: true
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
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