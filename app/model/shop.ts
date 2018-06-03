import { Sequelize, STRING, INTEGER, DATE, Instance, BOOLEAN } from "sequelize";

type IShopInstance = Instance<IShop> & IShop;
export let Shop = (database: Sequelize) => {
  let shop = database.define<IShopInstance, IShop>("shop", {
    password: STRING,
    shop_id: { type: INTEGER, primaryKey: true },
    shop_name: STRING,

    telphone: STRING,
    region: STRING,
    qq: STRING,
    city: STRING,
    addr: STRING,
    referrer: STRING,
    servicer: STRING,

    active_status: { type: BOOLEAN, defaultValue: false },
    active_time: DATE,

    legal_person_name: STRING,
    legal_person_mobi: STRING,
    boss_name: STRING,
    boss_mobi: STRING,
    manager_name: STRING,
    manager_mobi: STRING,
    area_size: INTEGER,
    rooms: INTEGER,
    skillers: INTEGER,
    branches: INTEGER,
    franchies: INTEGER,
    pictures: STRING,
    introduction: STRING,
    open_date: DATE,
    lat_lng: STRING
  });

  return shop;
};
