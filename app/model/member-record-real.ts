import { Sequelize, STRING, INTEGER, DATE, Instance, DECIMAL } from "sequelize";

// app/model/user.js

type IMemberRecordRealRealInstance = Instance<IMemberRecordReal> &
  IMemberRecordReal;

export let MemberRecordReal = (database: Sequelize) => {
  const memberRecordReal = database.define<
    IMemberRecordRealRealInstance,
    IMemberRecordReal
    >("member_record_real", {
      member_record_id: INTEGER,
      member_id: INTEGER,
      member_card_id: INTEGER,
      member_deal_type: STRING,
      amount: DECIMAL,
      balance: DECIMAL,
      integral: INTEGER,
      order_id: STRING,
      deal_date: DATE,
      deal_time: DATE,
      op_id: INTEGER,
      present: DECIMAL,
      comm: DECIMAL,
      shop_id: INTEGER
    }, {
        freezeTableName: true
      });
  memberRecordReal.removeAttribute('id');
  return memberRecordReal;
};
