import { Sequelize, STRING, INTEGER, DATE, Instance, DECIMAL } from "sequelize";

// app/model/user.js

type IMemberInfoRealInstance = Instance<IMemberInfoReal> & IMemberInfoReal;

export let MemberInfoReal = (database: Sequelize) => {
  const memberInfoReal = database.define<
    IMemberInfoRealInstance,
    IMemberInfoReal
  >("member_info_real", {
    member_record_id: INTEGER,
    member_id: INTEGER,
    member_card_id: STRING,
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
  });

  return memberInfoReal;
};
