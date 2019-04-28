// 测试功能

function CountDown(then) {      //  倒计时
  var totalSecond = 600;

  var interval = setInterval(function () {
    // 秒数  
    var second = totalSecond;

    // 分钟位  
    var min = Math.floor(second / 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    var sec = second - min * 60;
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;

    then.setData({
      countDownMinute: minStr,
      countDownSecond: secStr,
    });
    totalSecond--;
    if (totalSecond < 0) {
      clearInterval(interval);
      // 计时器跑完
      wx.showToast({
        title: '活动已结束',
      });
      then.setData({
        countDownMinute: '00',
        countDownSecond: '00',
      });
    }
  }.bind(then), 1000);
}



module.exports = {
  CountDown: CountDown
};