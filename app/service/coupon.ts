import { Service } from "egg";
import db = require("../model");

export default class Coupon extends Service {
  /**
   * 给用户分发优惠券
   * 1.根据优惠券的 coupon_id 查找到 对应的多张优惠券
   *
   *
   * mode =0 注册 mode=1 分享
   */
  async giveUserCoupons(
    coupon_id: number,
    shop_id: number,
    userid: number,
    member_name: string,
    phone: string,
    mode = 0
  ) {
    let isDebug = true;
    console.log(`调试模式${isDebug} 手机号 ${phone}`);
    let rules = await db.couponRuleRealModel.findAll({
      where: { shop_id },
      limit: 20
    });
    let shop = await db.shopModel.findOne({ where: { shop_id } });
    let claims: any[] = [];
    console.log(
      `准备开始送券之旅`,
      mode == 0 ? "注册券" : "分享券",
      `共有${rules.length}张券`
    );
    for (let rule of rules) {
      console.log(`可分享${rule.can_share}`, `可注册获得${rule.reg_give}`);
      let tickets = await db.couponRealModel.findAll({
        where: {
          shop_id,
          coupon_id: rule.coupon_id
        }
      });
      for (let ticket of tickets) {
        // 1.判断优惠券是否过期
        let isValidate =
          new Date(ticket.start_date).getTime() +
            ticket.valid_days * 24 * 60 * 60 * 1000 >
          new Date().getTime();
        console.log(`是否有效券` + isValidate);
        if (isValidate) {
          console.log(`有效券`);
          // 分享券
          if (rule.can_share == 1 && mode == 1) {
            console.log(`开始分享有效券`, userid);
            let claim = await db.couponClaimModel.create({
              shop_id: shop_id,
              coupon_id: coupon_id,
              member_id: userid,
              claim_time: new Date(),
              coupon_name: ticket.coupon_name,
              member_name,
              status: 0,
              claimer: 123
            });
            if (claim) claims.push(claim);
            if (shop) {
              // await this.service.alidayu.sendTicketMsg(
              //   phone,
              //   member_name,
              //   shop.shop_name,
              //   ticket.valid_days,
              //   ticket.denomination
              // );
            }
          }
          if (rule.reg_give == 1 && mode == 0) {
            console.log("赠送注册券成功");
            let claim = await db.couponClaimModel.create({
              shop_id: shop_id,
              coupon_id: coupon_id,
              member_id: userid,

              claim_time: new Date(),
              coupon_name: ticket.coupon_name,
              member_name,
              status: 0,
              claimer: 123
            });
            if (claim) claims.push(claim);
            if (shop) {
              // await this.service.alidayu.sendTicketMsg(
              //   phone,
              //   member_name,
              //   shop.shop_name,
              //   ticket.valid_days,
              //   ticket.denomination
              // );
            }
          }
        }
      }
    }
    return claims;
  }
  getCouponAndMaterialByShopId(shop_id: string) {
    return this.app.mysql
      .get("customer")
      .query(
        `select * from  customer.materials join m2centraldb.coupon_rule_real on customer.materials.coupon_id= coupon_rule_real.coupon_id where shop_id =?`,
        [shop_id]
      );
  }
}
