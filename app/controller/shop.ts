// cimport { and, or } from "sequelize";
import { Controller } from "egg";
// import { RewardRecordType } from "../../constant";
import Sequelize = require("sequelize");
import db = require("../model");

export default class Shop extends Controller {
  async updateShopLocation() {
    let { lat_lng } = this.ctx.request.body;
    let { shop_id } = this.ctx.query;
    let updateAction = await db.shop.update(
      { lat_lng },
      { where: { shop_id } }
    );
    this.ctx.body = { ok: true, data: updateAction };
  }

  /**
   * 商户登录
   */
  async signin() {
    let { username, password } = this.ctx.request.body;
    let shop = await db.shop.findOne({
      where: { shop_id: username, password }
    });
    let modules = await db.module.findAll();
    this.ctx.body = {
      ok: !!shop,
      data: shop ? { shop, modules } : "用户名或密码错误"
    };
  }
  async getShopTodayCustomers() {
    let { ctx } = this;
    let { shop_id } = ctx.query;
    /**
     * 今天的所有订单
     */
    let todayOrders = await db.shopOrderReal.findAll({
      where: { shop_id, deal_date: new Date(2017, 4, 24).format("yyyy-MM-dd") }
    });
    let todayOrderIds = todayOrders.map(order => order.order_id);
    // let todayMemberIds =todayOrders.map(order=>order.me)
    let todayMemberCardIds = todayOrders.map(order => order.member_card_id);
    let todayMembers = await db.memberRecordReal.findAll({
      where: {
        [Sequelize.Op.or]: [
          { member_card_id: { $in: todayMemberCardIds } },
          { order_id: { $in: todayOrderIds } }
        ]
      }
    });

    let orderGroup = todayOrders.map(order => {
      let memberRecord = todayMembers.find(
        member =>
          member.member_card_id == order.member_card_id ||
          member.order_id + "" == order.order_id + ""
      );
      return {
        memberRecord,
        order
      };
    });

    this.ctx.body = {
      ok: true,
      data: {
        totalOrderNum: todayOrders.length,
        totalMemberNum: todayMembers.length,
        todayOrders,
        todayMembers,
        orderGroup
      }
    };
  }

  /**
   * 分页获取店铺员工
   */
  async employeePage() {
    let { ctx } = this;
    let { page, pageSize, shop_id } = ctx.query;
    if (!page) page = 0;
    if (!pageSize) pageSize = 10;
    if (typeof page == "string") page = parseInt(page);
    if (typeof pageSize == "string") pageSize = parseInt(pageSize);
    let result = await db.employee.findAndCountAll({
      where: { shop_id },
      limit: pageSize,
      offset: page * pageSize
    });
    this.ctx.body = { ok: true, data: result };
  }

  async createEmployee() {
    let { ctx } = this;
    let { shop_id } = ctx.query;
    console.log(ctx.headers);

    let {
      password,
      name,
      sex,
      shop_code,
      nation,
      birthday,
      province,
      phone,
      id_card,
      id_card_addr,
      address,
      email,
      education_background,
      height,
      emergency_contact,
      emergency_contact_phone,
      emergency_contact_relationship,
      speciality,
      introducer,
      department,
      job,
      images,
      role_id
    } = ctx.request.body;
    if (!images) images = [];

    if (password && shop_code && phone) {
      let exisitEmployee = await db.employee.findOne({
        where: { [Sequelize.Op.or]: [{ shop_code }, { phone }] }
      });
      if (exisitEmployee) {
        this.ctx.body = { ok: false, data: "该手机号或员工编号已经存在" };
      } else {
        let newEmployee: IEmployee = {
          education_background,
          height,
          speciality,
          password,
          name,
          sex,
          shop_id,
          introducer,
          shop_code,
          nation,
          birthday,
          province,
          phone,
          id_card,
          id_card_addr,
          address,
          email,
          department,
          job,
          emergency_contact,
          emergency_contact_phone,
          images: images.join(","),
          emergency_contact_relationship,
          role_id
        };
        newEmployee = await db.employee.create(newEmployee);
        this.ctx.body = { ok: true, data: newEmployee };
      }
    } else {
      this.ctx.body = { ok: false, data: "信息不全" };
    }
  }
  /**
   * 更新员工资料
   */
  async updateEmployee() {
    let { shop_id, employee_id } = this.ctx.query;

    if (shop_id) {
      let updateEmployee = this.ctx.request.body;
      if (Array.isArray(updateEmployee.images)) {
        updateEmployee.images = updateEmployee.images.join(",");
      }
      let updateAction = await db.employee.update(updateEmployee, {
        where: { shop_id, employee_id }
      });
      this.ctx.body = { ok: true, data: updateAction };
    } else {
      this.ctx.body = { ok: false, data: "参数少数" };
    }
  }
  /**
   * 商户注册
   */
  async signup() {
    let {
      phone,
      authcode,
      shop_name,
      telphone,
      password,
      city,
      addr,
      referrer,
      legal_person_name,
      legal_person_mobi,
      boss_name,
      // boss_mobi,
      qq,
      region,
      area,

      address
    } = this.ctx.request.body;
    if (
      !phone ||
      !telphone ||
      !authcode ||
      !shop_name ||
      // !legal_person_mobi ||
      // !legal_person_name ||
      !boss_name
    ) {
      return (this.ctx.body = { ok: false, data: "信息不全" });
    }
    let ok = await this.service.alidayu.queryDetail(phone, authcode);
    if (ok) {
      /**
       *  商户用户
       *
       */
      let shopUser;
      /**
       * 商户
       */
      let shop;
      shopUser = await db.user.findOne({ where: { phone } });
      shop = await db.shop.findOne({ where: { boss_mobi: phone } });
      // db.shop.find({distinct:true,attributes:['shop_id']})

      if (!shop) {
        if (!shopUser) {
          shopUser = await db.user.create({
            phone: phone,
            password,
            user_name: boss_name,
            region,
            city,
            area,
            address
          });
        }
        let newShop = await db.shop.create({
          shop_id: shopUser.user_id,
          boss_mobi: phone,
          phone,
          shop_name,
          telphone,
          password,
          region,
          city,
          addr,
          referrer,
          legal_person_mobi,
          legal_person_name,
          boss_name,
          qq
        });
        this.ctx.body = { ok: true, data: newShop, user: shopUser };
      } else {
        this.ctx.body = { ok: false, data: "该手机号已注册为商家" };
      }
    } else {
      this.ctx.body = { ok: false, data: "手机号验证码错误" };
    }
  }
  async getAuthCode() {
    let { ctx } = this;
    let { phone } = ctx.query;
    let result = await this.service.alidayu.sendUserRegisiterAuthCode(phone);
    this.ctx.body = { ok: true, data: result };
  }

  async getShopEmployeeJobCategory() {
    let { shop_id } = this.ctx.query;
    let result = await db.shop.find({
      distinct: true,
      attributes: ["shop_id"],
      where: { shop_id }
    });
    this.ctx.body = { ok: true, data: result };
  }
  async getShopEmployeeDepartment() {
    let { shop_id } = this.ctx.query;
    let result = await db.employee.find({
      distinct: true,
      attributes: ["shop_id"],
      where: { shop_id }
    });
    this.ctx.body = { ok: true, data: result };
  }

  async listCoupinAndMaterialByShopId() {
    let { shop_id } = this.ctx.query;
    let result: any = <any>await this.app.mysql.get("m2centraldb").query(
      `
        SELECT coupon_real.coupon_id as coupon_id2,coupon_real.*,customer.materials.*,customer.materials.id as material_id  FROM coupon_real
 left join customer.materials on coupon_real.coupon_id= customer.materials.coupon_id 
 left join m2centraldb.coupon_rule_real on  coupon_real.coupon_id=m2centraldb.coupon_rule_real.coupon_id
where coupon_real.shop_id = ${shop_id}
        `
    );
    console.log(result);
    this.ctx.body = { ok: true, data: result };
  }

  async getModuleAll() {
    let result = await this.service.systemModule.getModuleAll();

    this.ctx.body = {
      ok: true,
      data: result
    };
  }
  async getModulePage() {
    let { page, pageSize } = this.ctx.query;
    let pageModule = await this.service.systemModule.getModulePage(
      page,
      pageSize
    );
    this.ctx.body = { ok: true, data: pageModule };
  }
  async createModule() {
    let newModule = this.ctx.request.body;
    let result = await this.service.systemModule.createModule(newModule);
    this.ctx.body = { ok: true, data: result };
  }
  async deleteModule() {
    let module_ids = this.ctx.request.body.module_ids;
    let result = await this.service.systemModule.deleteModule(module_ids);
    this.ctx.body = { ok: true, data: result };
  }
  async updateModule() {
    let module_id = await this.ctx.query.module_id;
    let module = await this.ctx.request.body;
    let result = await this.service.systemModule.updateModule(
      module_id,
      module
    );
    this.ctx.body = { ok: true, data: result };
  }
  async findModule(keyword) {
    let result = await this.service.systemModule.findModule(keyword);
    this.ctx.body = { ok: true, data: result };
  }
  async getRolePage() {
    let { page, pageSize, shop_id } = this.ctx.query;
    let pageRole = await this.service.systemModule.getRolePage(
      shop_id,
      page,
      pageSize
    );
    this.ctx.body = { ok: true, data: pageRole };
  }
  async createRole() {
    let newRole = this.ctx.request.body;
    newRole.modules_ids = JSON.stringify(newRole.modules_ids);
    let result = await this.service.systemModule.createRole(newRole);
    this.ctx.body = { ok: true, data: result };
  }
  async deleteRole() {
    let role_ids = this.ctx.request.body.role_ids;
    let result = await this.service.systemModule.deleteRole(role_ids);
    this.ctx.body = { ok: true, data: result };
  }
  async updateRole() {
    let role_id = await this.ctx.query.role_id;
    let role = await this.ctx.request.body;
    let result = await this.service.systemModule.updateRole(role_id, role);
    this.ctx.body = { ok: true, data: result };
  }
  async findRole(keyword) {
    let result = await this.service.systemModule.findModule(keyword);
    this.ctx.body = { ok: true, data: result };
  }
  async getUserList() {
    let { page, pageSize } = this.ctx.query;
    let pageUser = await this.service.systemModule.getUserList(page, pageSize);
    this.ctx.body = { ok: true, data: pageUser };
  }
  async createUser() {
    let newUser = this.ctx.request.body;
    let result = await this.service.systemModule.createUser(newUser);
    this.ctx.body = { ok: true, data: result };
  }
  async getRoleAll() {
    let result = await this.service.systemModule.getRoleAll(
      this.ctx.query.shop_id
    );
    this.ctx.body = { ok: true, data: result };
  }
  async deleteUser() {
    let user_ids = this.ctx.request.body.user_ids;
    let result = await this.service.systemModule.deleteUser(user_ids);
    this.ctx.body = { ok: true, data: result };
  }
  async updateUser() {
    let user_id = await this.ctx.query.user_id;
    let user = await this.ctx.request.body;
    let result = await this.service.systemModule.updateUser(user, user_id);
    this.ctx.body = { ok: true, data: result };
  }
  // async PostLogin() {
  //     let user_ids = this.ctx.query.user_id;
  //     let result = await this.service.systemModule.PostLogin(user_ids);
  //     this.ctx.body = { ok: true, data: result };
  // }
  async GetArticlesPage() {
    let { page, pageSize, option } = this.ctx.query;
    console.log(option, typeof option);
    if (option) {
      if (typeof option == "string") {
        option = JSON.parse(option);
        if (typeof option.startTime == "string")
          option.startTime = new Date(option.startTime);
        if (typeof option.endTime == "string")
          option.endTime = new Date(option.endTime);
      }
    }
    let articleslist = await this.service.systemModule.GetArticlesPage(
      page,
      pageSize,
      option
    );
    this.ctx.body = { ok: true, data: articleslist };
  }
  async createArticles() {
    let newArticles = this.ctx.request.body;
    let result = await this.service.systemModule.createArticles(newArticles);
    this.ctx.body = { ok: true, data: result };
  }
  async deleteArticles() {
    let articles_ids = this.ctx.request.body.articles_ids;
    let result = await this.service.systemModule.deleteArticles(articles_ids);
    this.ctx.body = { ok: true, data: result };
  }
  async updateArticles() {
    let articles_id = this.ctx.query.articles_id;
    let articles = this.ctx.request.body;
    let result = await this.service.systemModule.updateArticles(
      articles,
      articles_id
    );
    this.ctx.body = { ok: true, data: result };
  }
  async createCategroy() {
    let categroys = this.ctx.request.body;
    let result = await this.service.systemModule.createCategroy(categroys);

    this.ctx.body = { ok: true, data: result };
  }
  async deleteCategroy() {
    let categroy_ids = this.ctx.request.body.categroy_ids;
    let result = this.service.systemModule.deleteCategroy(categroy_ids);
    this.ctx.body = { ok: true, data: result };
  }
  async getArticleTypePage() {
    let { page, pageSize } = this.ctx.query;
    let pagecategroylist = await this.service.systemModule.getArticleTypePage(
      page,
      pageSize
    );
    this.ctx.body = { ok: true, data: pagecategroylist };
  }
  async getArticleTypeAll() {
    let result = await this.service.systemModule.getArticleTypeAll();
    this.ctx.body = { ok: true, data: result };
  }
  async updateCategroy() {
    let categroys_id = this.ctx.query.categroys_id;
    let categroys = this.ctx.request.body;
    let result = await this.service.systemModule.updateCategroy(
      categroys,
      categroys_id
    );
    this.ctx.body = { ok: true, data: result };
  }
  async getCommonPage() {
    let result = await this.service.systemModule.getCommonPage();
    this.ctx.body = { ok: true, data: result };
  }
  async createCommon() {
    let commons = this.ctx.request.body.commons;
    let result = await this.service.systemModule.createCommon(commons);
    this.ctx.body = { ok: true, data: result };
  }
  async recommandArticle() {
    let { articles_id, is_recommand } = this.ctx.request.body;

    let result = await this.service.systemModule.recommandArticle(
      is_recommand,
      articles_id
    );
    this.ctx.body = { ok: true, data: result };
  }
  async passArticle() {
    let articles_id = this.ctx.request.body.articles_id;
    let result = await this.service.systemModule.passArticle(articles_id);
    this.ctx.body = { ok: true, data: result };
  }
  async refuseArticle() {
    let articles_id = this.ctx.request.body.articles_id;
    let result = await this.service.systemModule.refuseArticle(articles_id);
    this.ctx.body = { ok: true, data: result };
  }
}
