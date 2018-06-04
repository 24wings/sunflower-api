import { Application } from "egg";
let shopApi = {
  /**
   * 商户登录
   *
   * body:{username,password}
   */
  signin: "/api/shop/signin",
  /**
   * 商户注册
   * body:IShop,authcode
   *
   */
  signup: "/api/shop/signup",
  /**
   * 员工分页
   */
  employeePage: "/api/shop/employee-page",
  /**
   * 创建员工
   */
  createEmployee: "/api/shop/create-employee",
  /**
   * 获取
   * * 省份
   *    * 城市
   *      * 区域
   * 返回 IRegion[]
   */
  getCityJSON: "/city.json",
  /**
   * get  ? phone
   */
  shopSignupAuthCode: "/api/shop/authcode",
  /**
   * ?shop_id
   */
  employeeJobCategory: "/api/shop/employee/job-category",
  /**
   * ?shop_id
   */
  employeeDepartmentCategory: "api/shop/employee/department-category",
  /**
   * 获取商户的今日业绩统计
   * ?shop_id
   */
  getShopBussiness: "/api/shop/bussiness"
};

module.exports = (app: Application) => {
  let shop = app.controller.shop;
  app.router
    .post(shopApi.signin, shop.signin)
    .post(shopApi.signup, shop.signup)
    .get(shopApi.employeePage, shop.employeePage)
    .post(shopApi.createEmployee, shop.createEmployee)
    .get(shopApi.shopSignupAuthCode, shop.getAuthCode)
    .get(shopApi.employeeDepartmentCategory, shop.getShopEmployeeDepartment)
    .get(shopApi.employeeJobCategory, shop.getShopEmployeeJobCategory)
    .get(shopApi.getShopBussiness, shop.getShopTodayCustomers);
};
