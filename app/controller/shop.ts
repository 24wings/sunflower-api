// cimport { and, or } from "sequelize";
import { Controller } from "egg";
// import { RewardRecordType } from "../../constant";
import db = require("../model");

export default class Shop extends Controller {

    async signin() {
        let { username, password } = this.ctx.request.body;
        let shop = await db.shopModel.findOne({ where: { shop_id: username, password } });
        this.ctx.body = { ok: !!shop, data: shop ? shop : "用户名或密码错误" };
    }
    async getShop() {

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
