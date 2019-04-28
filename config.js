/**
 * 小程序配置文件
 */


var host = "www.flaxl.cn/api"

var config = {

  // 下面的地址配合云端 Server 工作
  host,
  // 首页获取骑手位置信息接口
  show: `https://${host}/Userlogin/show`,
  
  // 微信获取openId
  wxCode: `https://${host}/Wxlogin/wxCode`,

 
  // 获取微信吊起支付参数
  pays: `https://${host}/Order/pays`,

  // 获取微信次付款发起支付参数
  paynumber: `https://${host}/Order/paynumber`,

  // 登录地址，用于建立会话
  loginUrl: `https://${host}/Wxlogin/wxLogin`,

  // 登录后绑定手机号接口
  wxuser: `https://${host}/Wxlogin/wxuser`,


  // 下单接口
  orderInsert: `https://${host}/Userorder/orderInsert`,


  // 下单查看接单状态接口
  orderStatus: `https://${host}/Userorder/orderStatus`,

  // 下单后点击取消订单接口
  orderCancel: `https://${host}/Userorder/orderCancel`,

  // 下单后无人接口再次发起订单接口
  user: `https://${host}/Userorder/user`,

  

  // 地址删除接口
  addressDel: `https://${host}/Useraddress/addressDel`,

  // 查看所有地址接口
  addressIndex: `https://${host}/Useraddress/addressIndex`,

  // 发短信接口
  msg: `https://${host}/Userlogin/send`,

  // 订单 全部订单
  orderuser: `https://${host}/order/orderuser`,

  // 评价列表
  commentlists: `https://${host}/comment/commentlists`,

  // 星级评分
  review: `https://${host}/comment/review`,
  // 图片上传
  uploadimg: `https://${host}/comment/uploadimg`,

  // 服务费支付
  orderPay: `https://${host}/Userorder/orderPay`,

  // 服务费管理
  changeShow: `https://${host}/Charge/chargeShow`,

  // 服务费购买
  chargeRenew: `https://${host}/Charge/chargeRenew`,

  // 头像上传
  upload: `https://${host}/Uploads/upload`,

  // 是否认证
  paymentIf: `https://${host}/Payment/paymentIf`,
  // 获取认证图片
  paymentshow: `https://${host}/Payment/paymentshow`,
  
  

  //设为默认接口 
  addressDefault: `https://${host}//Useraddress/addressDefault`,

  // 添加地址接口
  addressInsert: `https://${host}/Useraddress/addressInsert`,

  // 修改地址接口
  addressUpdate: `https://${host}/Useraddress/addressUpdate`,
  
  // 编辑地址详情展示接口
  addressShow: `https://${host}/Useraddress/addressShow`,

  // 服务费管理
  chargeShow: `https://${host}/Charge/chargeShow`,
  //历史账单 
  chargeBill: `https://${host}/Charge/chargeBill`,
  //订单点击确认
  complatedBut: `https://${host}/order/complatedBut`,

  //点击加号上传认证
  ren_uploadimg: `https://${host}/payment/uploadimg`,
  //点击按钮总的上传
  paymentRecognize: `https://${host}/Payment/paymentRecognize`
}

module.exports = config
