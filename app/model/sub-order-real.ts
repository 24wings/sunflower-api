import {
  Sequelize,
  STRING,
  INTEGER,
  DATE,
  Instance,
  DECIMAL,
  TIME
} from "sequelize";

type ISubOrderRealInstance = Instance<ISubOrderReal> & ISubOrderReal;

export let SubOrderReal = (database: Sequelize) => {
  const subOrderReal = database.define<ISubOrderRealInstance, ISubOrderReal>(
    "sub_order_real",
    {
      sub_order_id: INTEGER,
      order_id: STRING,
      room_id: INTEGER,
      payed_flg: INTEGER,
      staff_id: INTEGER,
      staff_male: STRING,
      hand_card_id: STRING,
      sub_order_type: STRING,
      sub_order_name: STRING,
      item_id: INTEGER,
      start_time: TIME,
      end_time: TIME,
      price: DECIMAL,
      number: INTEGER,
      sub_order_date: DATE,
      sub_order_time: DATE,
      op_id: INTEGER,
      sale_id: INTEGER,
      turn_method: INTEGER,
      spend_amount: DECIMAL,
      set_off_flag: STRING,
      reserve_str: STRING,
      clock_status: INTEGER,
      via_flag: INTEGER,
      shop_id: INTEGER
    },
    {
      freezeTableName: true,
      underscored: true
    }
  );
  subOrderReal.removeAttribute("id");

  return subOrderReal;
};
