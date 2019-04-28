//app.js
var CusBase64 = require('utils/base64.js'); //引用base64加密

App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null
  },
  tobase64: function (obj) {
    var base64 = obj;
    for (var i = 0; i < 3; i++) {
      base64 = CusBase64.CusBASE64.encoder(base64)
      // console.log(CusBase64.CusBASE64.decoder(base64))
    }
    return base64
  },
  base64toStr: function (obj) {
    var base64 = obj;
    for (var i = 0; i < 3; i++) {
      base64 = CusBase64.CusBASE64.decoder(base64)
      // console.log(CusBase64.CusBASE64.decoder(base64))
    }
    return base64
  },
  isCardNo: function (card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
      wx.showToast({
        title: '身份证信息不合法',
        icon: "none"
      })
      return false;
    }else{
      return true;
    }
  }

})