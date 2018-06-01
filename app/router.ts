import { Application } from "egg";

export default (app: Application) => {
  require("./route/customer.route")(app);
  require("./route/shop.route")(app);

};
