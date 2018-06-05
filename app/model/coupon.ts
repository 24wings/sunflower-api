import {
  Sequelize,
  STRING,
  INTEGER,
  DATE,
  Instance,
  DATEONLY
} from "sequelize";

interface ICoupon {
  coupon_id: number;
  coupon_name: string;
  denomination: number;
  totle_count: number;
  claimed_count: number;
  status: number;
  start_type: number;
  start_date: Date;
  valid_days: number;
  description: string;
  update_time: Date;
  shop_id: number;
}
type ICouponInstance = Instance<ICoupon> & ICoupon;
export let Coupon = (database: Sequelize) => {
  const coupon = database.define<ICouponInstance, ICoupon>(
    "coupon",
    {
      coupon_id: INTEGER,
      coupon_name: INTEGER,
      denomination: DATE,
      totle_count: DATE,
      claimed_count: INTEGER,
      status: INTEGER,
      valid_days: INTEGER,
      start_type: INTEGER,
      start_date: DATEONLY,
      description: STRING,
      //   avaliable_items: STRING,
      update_time: DATE,
      shop_id: INTEGER
    },
    {
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
      underscored: true
    }
  );
  coupon.removeAttribute("id");
  return coupon;
};
