import { Sequelize, INTEGER, Instance, DECIMAL } from "sequelize";

export interface ISmsInfo {
  shop_id?: number;
  sms_surplus: number;
  deposit: number;
}

type ISmsInfoInstance = Instance<ISmsInfo> & ISmsInfo;
export let SmsInfo = (database: Sequelize) => {
  let smsInfo = database.define<ISmsInfoInstance, ISmsInfo>(
    "sms_info",
    {
      shop_id: INTEGER,
      sms_surplus: INTEGER,
      deposit: DECIMAL
    },
    {
      freezeTableName: true,
      underscored: true,
      createdAt: false,
      updatedAt: false
    }
  );
  smsInfo.removeAttribute("id");

  return smsInfo;
};
