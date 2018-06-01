import { Service } from "egg";
import db = require("../model");
// import SMSClien = require("@alicloud/sms-sdk");

import SMSClient = require("@alicloud/sms-sdk");
// const accessKeyId = "LTAIcMnaxxUG7dbk";  //我的
// const secretAccessKey = "VhNgQZrGYz7dXpiCUS8r36mbLgy6db"; //我的
const accessKeyId = "LTAIwItdPKtaGFo6";
const secretAccessKey = "mwWHkKrkoYr7QxdH1Txuan2eRWj1OD";

let smsClient = new SMSClient({ accessKeyId, secretAccessKey });
let signature = {
  // bangwei: "邦为科技"
  bangwei: "众合致胜"
};
let templateCodes = {
  //bangweiUserAuthCode: "SMS_127158851", // 验证码
  bangweiUserAuthCode: "SMS_120376411",
  bangweiRegisterRequest: "SMS_130915509", // 短信通知
  bangweiVerifyPass: "SMS_130920608" // 初审通过 ,邀请来邦为面试
};
export default class Alidayu extends Service {
  /** 生成随机二维码 */
  private getRandomCode() {
    return (Math.random() * 10000).toFixed(0);
  }

  async sendUserRegisiterAuthCode(Phone: string, code?: string) {
    if (!code) {
      code = this.getRandomCode();
    }
    return smsClient.sendSMS({
      PhoneNumbers: Phone,
      SignName: signature.bangwei,
      TemplateCode: templateCodes.bangweiUserAuthCode,
      TemplateParam: `{"code":"${code}"}`,
      OutId: code
    });
  }
  /**
   *
   * 尊敬的会员${customer}，${shop}赠送您一张${amount}元的代金券，有效期：${validdate}。
   * @param phone
   * @param memeber_name
   */
  async sendTicketMsg(
    phone: string,
    memeber_name: string,
    shop_name: string,
    validdate: number,
    amount
  ) {
    return smsClient.sendSMS({
      TemplateParam: `{"customer":"${memeber_name}","shop":"${shop_name}","amount":"${amount}","validdate":"${validdate}"}`,
      TemplateCode: "SMS_121912058",
      PhoneNumbers: phone,
      SignName: signature.bangwei
    });
  }

  async queryDetail(phone: string, authcode: string): Promise<boolean> {
    let res = await smsClient.queryDetail({
      PhoneNumber: phone,
      SendDate: new Date().format("yyyyMMdd"),
      PageSize: "10",
      CurrentPage: "1"
    });
    if (res.Code == "OK") {
      let detail = res.SmsSendDetailDTOs.SmsSendDetailDTO[0];
      if (detail) {
        return detail.OutId == authcode;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async queryDetailByBizId(phone: string) {
    return smsClient.queryDetail({
      PhoneNumber: phone,
      SendDate: new Date().format("yyyyMMdd"),
      PageSize: "10",
      CurrentPage: "1"
      // BizId
    });
  }
  async lessShopSurplus(shop_id: number) {
    return db.sunflower.query(`
update m2centraldb.sms_info  set sms_surplus = IF(sms_surplus<= 1,0,sms_surplus-1) WHERE shop_id =${shop_id}
`);
  }
}
