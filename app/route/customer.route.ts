import { Application } from "egg";
// let wechatApi = {
//   getAuthurl: "/getAuthurl",
//   visitorMode: "/visitor/mode",
//   shopUserSignup: "/shopuser/signup",
//   listButtons: "/wechat/list-buttons",
//   createMenu: "/wechat/create-menu",
//   removeMenu: "/wechat/remove-menu",
//   submitShop: "/wx/query-submit-shop"
// };
module.exports = (app: Application) => {
  let customer = app.controller.customer;

  app.router
    .get("/auth", customer.index)
    .get("/", customer.index)
    .get("/authUrl", customer.getAuthUrl)
    // 短信 shop_id ,
    .get("/home/send-shop-authcode", customer.sendShopAuthCode)
    .post("/test/upload", customer.uploadBase64Test)
    .get("/getImage", customer.getImage)
    .get("/getAuthCode", customer.sendAuthCode)
    .post("/signup", customer.signup2)
    .post("/create-material", customer.createMaterial)
    .get("/material", customer.getMaterial)
    .get("/pc/list-shop-materials", customer.listMaterial)
    .post("/pc/update-shop-material", customer.updateMaterial)
    .get("/pc/get-shop-tickets", customer.getShopTickets)
    .get("/pc/get-tickets-by-keyword", customer.getTciketsByKeyword)
    .post("/pc/sync-tickets-data-complete", customer.syncTicketsDataComplete)
    .post(`/pc/sync-shop-tickets-data`, customer.syncTicketsData)
    .get(`/home/is-openid-login`, customer.isOpenidLogin)
    .all("/message", customer.message)
    .get("/common/qrcode", customer.getQrcode)
    .post("/common/qrcode", customer.getQrcode)
    .get("/wechat/ticket", customer.getTicket)
    .get("/common/wechat/ticket", customer.getTicket)
    .post("/common/upload/image", customer.uploadBase64)
    .get("/common/send-auth-code", customer.sendAuthCode);
};
