import Sequlize = require("sequelize");

export let sunflower = new Sequlize("sunflower", "misheng", "misheng", {
  host: "47.100.23.203",
  dialect: "mysql",
  pool: {
    max: 5
  },
  define: {
    underscored: true,

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
import { SyncUser } from './sync-users';

// customer model
export let materialModel = Material(sunflower);
export let cloudinaryImageModel = CloudinaryImage(sunflower);
export let ossFileModel = OSSFile(sunflower);


export let couponClaimModel = CouponClaim(sunflower);
export let syncUserModel = SyncUser(sunflower);

// // m2 model
export let couponRuleRealModel = CouponRuleReal(sunflower);
export let couponRealModel = CouponReal(sunflower);
export let shopModel = Shop(sunflower);
export let wxUserModel = WxInfo(sunflower);
export let userModel = User(sunflower);
export let smsRecordModel = SmsRecord(sunflower);
export let smsInfoModel = SmsInfo(sunflower);
