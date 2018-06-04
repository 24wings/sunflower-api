import {
  Sequelize,
  STRING,
  INTEGER,
  DATE,
  Instance,
  DECIMAL,
  TIME
} from "sequelize";

type IShopOrderDetailInstance = Instance<IShopOrderDetail> & IShopOrderDetail;

export let ShopOrderReal = (database: Sequelize) => {
  const shopOrderReal = database.define<
    IShopOrderDetailInstance,
    IShopOrderDetail
  >(
    "shoporder_real",
    {
      order_id: INTEGER,
      deal_date: STRING,
      deal_time: TIME,
      op_id: INTEGER,
      staff_id: STRING,
      male_cus: INTEGER,
      major_item_desc: STRING,
      item_desc: STRING,
      commodity_desc: STRING,
      card_desc: STRING,
      price_sum: DECIMAL,
      cash: DECIMAL,
      unionpay: DECIMAL,
      pet_card: DECIMAL,
      coupon: DECIMAL,
      groug: DECIMAL,
      tally: DECIMAL,
      other: DECIMAL,
      free_flg: STRING,
      member_card_id: STRING,
      comments: STRING,
      room_id: INTEGER,
      female_cus: INTEGER,
      op_time: DATE,
      webchat: STRING,
      alipay: STRING,
      pay1: DECIMAL,
      pay1num: STRING,
      pay2: DECIMAL,
      pay2num: STRING,
      pay3: DECIMAL,
      pay3num: STRING,
      pay4: DECIMAL,
      pay4num: STRING,
      pay5: DECIMAL,
      pay5num: STRING,
      pay6: DECIMAL,
      pay6num: STRING,
      pay7: DECIMAL,
      pay7num: STRING,
      pay8: DECIMAL,
      pay8num: STRING,
      pay9: DECIMAL,
      pay9num: STRING,
      pay10: DECIMAL,
      pay10num: STRING,
      shop_id: STRING
    },
    {
      freezeTableName: true,
      underscored: true
    }
  );
  shopOrderReal.removeAttribute("id");

  return shopOrderReal;
};
