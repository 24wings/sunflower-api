import { Application } from "egg";
let pcClientApi = {
  login: "/pc/login"
};

module.exports = (app: Application) => {
  let shop = app.controller.shop;
  app.router
    .post(pcClientApi.login, shop.signin)

    .get(
      `/pc/list-coupin-and-material-by-shop_id`,
      shop.listCoupinAndMaterialByShopId
    )


};
