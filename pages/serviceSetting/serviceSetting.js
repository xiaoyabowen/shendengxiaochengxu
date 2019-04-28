const changeShow = require('../../config').changeShow
// pages/serviceSetting/serviceSetting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    setLogin: true,// 是否开通
    frequency: 10, // 剩余次数
    node: "",//注释
    click_type:"",//判断的是哪个  /年/季/月  值和默认的值
    nodelist: [],//注释列表
    btn_price: "",// 立即按钮对应的价格
    btn_show:true,
    settings_id:"",
    // 开通  对应的内容
    settingLogin: {
      setLoginImg: "../../images/set-guan.png",
      setDate: "2018-12-12",
      setSucfont: "",
      setSucfontindex: 0
    },
    // 未开通  对应的内容
    settingNoneLogin: {
      setLoginImg: "../../images/set-guan-sub.png"
    },
    // 续费
    // 各种支付类型数据
    settings: [
      {
        id:"",
        select: false,//判断是否是点击状态
        // bar: "年",
        bar: "年",
        price: "170"
      },
      {
        id: "",
        select: false,
        bar: "季",
        price: "70"
      },
      {
        id: "",
        select: false,
        bar: "月",
        price: "40"
      },
      {
        id: "",
        select: false,
        bar: "次",
        price: "20"
      }
    ]
  },
  // 点击  4个支付类型  事件
  mode: function (e) {
    var inx = e.currentTarget.dataset.index;
    var that = this;
    var yuan = true;
    var back = 'settings[' + inx + '].select';
    for (var i = 0; i < 4; i++) {
      var x = 'settings[' + i + '].select'
      that.setData({
        [x]: false,
        [back]: yuan
      });
    };
    // 判断按钮是否显示
    if (that.data.frequency == 0){
      if (inx == 3){
        that.setData({
          btn_show: false
        });
      }else{
        that.setData({
          btn_show: true
        });
      }
    }else{
      if (inx != that.data.settingLogin.setSucfontindex) {
        that.setData({
          btn_show: false
        });
      } else {
        that.setData({
          btn_show: true
        });
      }
    }
    
    // 判断选择的注释话语
    var nodes = "";
    var click_types = "";
    switch (inx) {
      case 0:
        // 语句;
        nodes = this.data.nodelist[inx];
        click_types = this.data.settings[inx].bar;
        break;
      case 1:
        // 语句;
        nodes = this.data.nodelist[inx];
        click_types = this.data.settings[inx].bar;
        break;
      case 2:
        // 语句;
        nodes = this.data.nodelist[inx];
        click_types = this.data.settings[inx].bar;
        break;
      case 3:
        // 语句;
        nodes = this.data.nodelist[inx];
        break;
    }
    that.setData({
      node: nodes,
      click_type: click_types,
      btn_price: this.data.settings[inx].price,
      settings_id: this.data.settings[inx].id
    })
  },



  // 点击跳转  并传值
  navigator: function(){
    // console.log(this.data.click_type);
    var obj_Login = {
      setLogin: this.data.setLogin,
      settingLogininx: this.data.settingLogin.setSucfont,
      price_num: this.data.btn_price,
      note: this.data.node,
      click_types: this.data.click_type,
      _set: this.data.settings_id
    }
    wx.navigateTo({
      url: '../open/open?setLogin=' + JSON.stringify(obj_Login)
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
    
  },
  onShow:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 后台数据渲染
    wx.request({
      url: changeShow,
      data: {
        user_id: that.data.userId
      },
      method: 'POST',
      success: function (res) {
        var data = res.data.data;
        console.log(data)
        // 判断是否开通  和剩余次数
        if (data.if_info == 2) {
          that.setData({
            frequency: 0,
            setLogin: false,
            click_type: "年付",
            settings_id: 1
          })
          // console.log(that.data.click_type)
        } else {
          var payname = data.user_payment.payment_type_name;
          var setSucfont_index = "";
          var set_id = "";
          switch (payname) {
            case "年付":
              // 语句;
              set_id = 1;
              setSucfont_index = 0;
              break;
            case "季付":
              // 语句;
              set_id = 2;
              setSucfont_index = 1;
              break;
            case "月付":
              // 语句;
              set_id = 3;
              setSucfont_index = 2;
              break;
          }
          var setSucfontindex = "settingLogin.setSucfontindex"
          // 保存  剩余次数的开通
          that.setData({
            frequency: data.user_payment.payment_number,
            setLogin: true,
            [setSucfontindex]: setSucfont_index,
            settings_id: set_id
          })
        }

        for (var i = 0; i < data.payment_info.length; i++) {
          var setting_price = "settings[" + i + "].price"
          var setting_bar = "settings[" + i + "].bar"
          var nodelist = "nodelist[" + i + "]"
          var srtting_id = "settings[" + i + "].id"
          that.setData({
            [setting_price]: data.payment_info[i].payment_price,
            [setting_bar]: data.payment_info[i].payment_type_name,
            [nodelist]: "一次性付款，一" + data.payment_info[i].payment_type_name.charAt(0) + "内可进行" + data.payment_info[i].payment_number + "次订单发起\n时间不限，用完即止",
            [srtting_id]: data.payment_info[i].payment_type_id
          })
          // console.log(that.data.settings[i].id)
        }
        var x = that.data.settingLogin.setSucfontindex;
        var y = "";
        var c = "";
        switch (x) {
          case 0:
            // 语句;
            y = "年付";
            c = "年";
            break;
          case 1:
            // 语句;
            y = "季付";
            c = "季";
            break;
          case 2:
            // 语句;
            y = "月付";
            c = "月";
            break;
        }
        // 上面小字
        var z = "settingLogin.setSucfont";

        // 开通的对应的索引值
        var za = that.data.settingLogin.setSucfontindex;
        var sel = "settings[" + za + "].select";
        // 次数
        var ci = that.data.frequency;
        if (ci == 0) {
          ci = false;
        };
        that.setData({
          [z]: c,
          click_type: y,
          [sel]: true,
          setLogin: ci,
          node: that.data.nodelist[za],
          btn_price: that.data.settings[za].price
        })
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  }
})