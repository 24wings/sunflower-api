import { Sequelize, STRING, INTEGER, Instance } from "sequelize";

export interface ISmsRecord {
  id?: number;
  shop_id?: number;
  type?: number;
  msg?: string;
  mobilenum?: string;
  time?: string;
}

type ISmsRecordInstance = Instance<ISmsRecord> & ISmsRecord;
export let SmsRecord = (database: Sequelize) => {
  let smsRecord = database.define<ISmsRecordInstance, ISmsRecord>(
    "sms_record",
    {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      shop_id: INTEGER,
      type: INTEGER,
      msg: STRING,
      time: STRING
    },
    {
      freezeTableName: true,
      underscored: true,
      createdAt: false,
      updatedAt: false
    }
  );

  return smsRecord;
};
