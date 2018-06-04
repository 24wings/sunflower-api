import { Application } from "egg";

let adminApi = {
  login: "/admin/login",
  systemModule: {
    getModulePage: "/admin/get-modulePage", //模块分页
    getModuleAll: "/admin/get-module-all", //所有模块列表
    createModule: "/admin/create-module", //创建模块
    deleteModule: "/admin/delete-module", //删除
    updateModule: "/admin/update-module", //更新模块
    findModule: "/admin/find-module", //查找模块
    getRolePage: "/admin/get-role", //角色列比分页
    createRole: "/admin/create-role", //创建角色
    deleteRole: "/admin/delete-role", //删除角色
    updateRole: "/admin/update-role", //更新角色
    findRole: "/admin/find-role", //查找角色
    createUser: "/admin/create-user", //创建用户
    deleteUser: "/admin/delete-user", //删除用户
    updateUser: "/admin/update-user", //更新用户
    getUserList: "/admin/get-user-list", //用户分页
    getRoleAll: "/admin/get-all-role", //获取所有角色列表
    PostLogin: "/admin/login", //用户的权限列表
    GetArticlesPage: "/admin/get-articles-list", //文章列表
    createArticles: "/admin/create-articles", //新增文章
    deleteArticles: "/admin/delete-articles", //删除文章
    updateArticles: "/admin/update-articles", //更新文章
    createCategroy: "/admin/create-article-categroy", //新增文章分组
    deleteCategroy: "/admin/delete-article-categroy", //删除文章分组
    getArticleTypePage: "/admin/article/get-article-type-page", //文章组列表分页
    updateCategroy: "/admin/update-article-categroy", //更新文章组
    getArticleTypeAll: "/admin/get-article-categroy-all", //获取所有文章分类
    getCommonPage: "/admin/get-commonpage", //获取所有的评论
    createCommon: "/admin/create-commons", //新增评论
    recommandArticle: "/admin/recommand-article", //推荐文章
    passArticle: "/admin/pass-article", //通过文章审核
    refuseArticle: "/admin/refuse-article", //文章审核不通过
    //邦为业务
    m2Login: "/admin/m2-login" //邦为登录
  }
}



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
    .get(shopApi.getShopBussiness, shop.getShopTodayCustomers)


    .get(adminApi.systemModule.getModuleAll, shop.getModuleAll)
    .get(adminApi.systemModule.getModulePage, shop.getModulePage)
    .post(adminApi.systemModule.createModule, shop.createModule)
    .post(adminApi.systemModule.deleteModule, shop.deleteModule)
    .post(adminApi.systemModule.updateModule, shop.updateModule)
    .get(adminApi.systemModule.findModule, shop.findModule)
    .get(adminApi.systemModule.getRolePage, shop.getRolePage)
    .post(adminApi.systemModule.createRole, shop.createRole)
    .post(adminApi.systemModule.deleteRole, shop.deleteRole)
    .post(adminApi.systemModule.updateRole, shop.updateRole)
    .get(adminApi.systemModule.findRole, shop.findRole)
    .post(adminApi.systemModule.createUser, shop.createUser)
    .post(adminApi.systemModule.deleteUser, shop.deleteUser)
    .post(adminApi.systemModule.updateUser, shop.updateUser)
    .get(adminApi.systemModule.getUserList, shop.getUserList)
    .get(adminApi.systemModule.getRoleAll, shop.getRoleAll)

    .post(adminApi.systemModule.createCategroy, shop.createCategroy)
    .post(adminApi.systemModule.deleteCategroy, shop.deleteCategroy)
    .get(
      adminApi.systemModule.getArticleTypePage,
      shop.getArticleTypePage
    )
    .get(
      adminApi.systemModule.GetArticlesPage,
      shop.GetArticlesPage
    )
    .get(
      adminApi.systemModule.getArticleTypeAll,
      shop.getArticleTypeAll
    )
    .post(adminApi.systemModule.createArticles, shop.createArticles)
    .post(adminApi.systemModule.updateCategroy, shop.updateCategroy)
    .get(adminApi.systemModule.getCommonPage, shop.getCommonPage)
    .post(adminApi.systemModule.createCommon, shop.createCommon)
    .post(
      adminApi.systemModule.recommandArticle,
      shop.recommandArticle
    )
    .post(adminApi.systemModule.updateArticles, shop.updateArticles)
    .post(adminApi.systemModule.passArticle, shop.passArticle)
    .post(
      adminApi.systemModule.refuseArticle,
      shop.recommandArticle
    )
  // 邦为业务
  //.post(adminApi.systemModule.m2Login, controller.m2Admin.m2Login);
};

