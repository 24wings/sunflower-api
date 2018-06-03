// cimport { and, or } from "sequelize";
import { Controller } from "egg";
// import { RewardRecordType } from "../../constant";
import Sequelize = require("sequelize");
import db = require("../model");

export default class Shop extends Controller {
  /**
   * 商户登录
   */
  async signin() {
    let { username, password } = this.ctx.request.body;
    let shop = await db.shopModel.findOne({
      where: { shop_id: username, password }
    });
    this.ctx.body = { ok: !!shop, data: shop ? shop : "用户名或密码错误" };
  }

  /**
   * 分页获取店铺员工
   */
  async employeePage() {
    let { ctx } = this;
    let { page, pageSize, shop_id } = ctx.query;
    if (!page) page = 0;
    if (!pageSize) pageSize = 10;
    if (typeof page == 'string') page = parseInt(page);
    if (typeof pageSize == 'string') pageSize = parseInt(pageSize);
    let result = await db.employeeModel.findAndCountAll({
      where: { shop_id },
      limit: pageSize,
      offset: page * pageSize
    });
    this.ctx.body = { ok: true, data: result };
  }

  async createEmployee() {
    let { ctx } = this;
    let { shop_id } = ctx.query;
    console.log(ctx.headers)

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
      images
    } = ctx.request.body;
    if (!images) images = [];

    if (password && shop_code && phone) {
      let exisitEmployee = await db.employeeModel.findOne({
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
          images: images.join(','),
          emergency_contact_relationship
        };
        newEmployee = await db.employeeModel.create(newEmployee);
        this.ctx.body = { ok: true, data: newEmployee };
      }
    } else {
      this.ctx.body = { ok: false, data: '信息不全' }
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
      shopUser = await db.userModel.findOne({ where: { phone } });
      shop = await db.shopModel.findOne({ where: { boss_mobi: phone } });
      // db.shopModel.find({distinct:true,attributes:['shop_id']})

      if (!shop) {
        if (!shopUser) {
          shopUser = await db.userModel.create({
            phone: phone,
            password,
            user_name: boss_name,
            region,
            city,
            area,
            address
          });
        }
        let newShop = await db.shopModel.create({
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
        this.ctx.body = { ok: false, data: "该手机号已注册为商家" }
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
    let result = await db.shopModel.find({ distinct: true, attributes: ['shop_id'], where: { shop_id } });
    this.ctx.body = { ok: true, data: result };
  }
  async getShopEmployeeDepartment() {
    let { shop_id } = this.ctx.query;
    let result = await db.employeeModel.find({ distinct: true, attributes: ['shop_id'], where: { shop_id } });
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
}
