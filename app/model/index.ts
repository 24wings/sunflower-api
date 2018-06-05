import Sequlize = require("sequelize");

export let sunflower = new Sequlize("sunflower", "misheng", "misheng", {
  host: "47.100.23.203",
  dialect: "mysql",
  pool: {
    max: 5
  },
  define: {
    underscored: true
  }
});
export let m2centraldb = new Sequlize("m2centraldb", "misheng", "misheng", {
  // host: "221.234.36.118",
  host: "47.100.23.203",
  dialect: "mysql",
  pool: {
    max: 5
  },
  define: {
    underscored: true,
    createdAt: false,
    updatedAt: false
  }
});

import { CloudinaryImage } from "./cloudinary-image";
import { Material } from "./material";
import { OSSFile } from "./oss-file";
import { CouponClaim } from "./coupon-claim";
import { CouponReal } from "./coupon-real";
import { CouponRuleReal } from "./coupon-rule-real";
import { Shop } from "./shop";
import { WxInfo } from "./wx-info";
import { User } from "./user";
import { SmsRecord } from "./sms_record";
import { SmsInfo } from "./sms_info";
import { SyncUser } from "./sync-users";
import { Employee } from "./employee";
import { Role } from "./role";
import { Article } from "./article";
import { Categroy } from "./article-category";
import { Comment } from "./comment";
import { Module } from "./module";
import { SubOrderReal } from "./sub-order-real";
import { MemberInfoReal } from "./member-info-real";
import { MemberRecordReal } from "./member-record-real";
import { ShopOrderReal } from "./shop-order-real";
import { Coupon } from "./coupon";
import { CouponRule } from "./coupon_rule";

// database sunflower
export let material = Material(sunflower);
export let cloudinaryImage = CloudinaryImage(sunflower);
export let ossFile = OSSFile(sunflower);
export let couponClaim = CouponClaim(sunflower);
export let syncUser = SyncUser(sunflower);
export let couponRuleReal = CouponRuleReal(sunflower);
export let couponReal = CouponReal(sunflower);
export let shop = Shop(sunflower);
export let wxUser = WxInfo(sunflower);
export let user = User(sunflower);
export let smsRecord = SmsRecord(sunflower);
export let smsInfo = SmsInfo(sunflower);
export let employee = Employee(sunflower);
export let role = Role(sunflower);
export let article = Article(sunflower);
export let articleCategory = Categroy(sunflower);
export let comment = Comment(sunflower);
export let module = Module(sunflower);
export let coupon = Coupon(sunflower);
export let couponRule = CouponRule(sunflower);
// m2centraldb
export let subOrderReal = SubOrderReal(m2centraldb);
export let memberInfoReal = MemberInfoReal(m2centraldb);
export let memberRecordReal = MemberRecordReal(m2centraldb);
export let shopOrderReal = ShopOrderReal(m2centraldb);
export { VerifyStatus } from "./article";
