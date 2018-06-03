import {
  Sequelize,
  STRING,
  INTEGER,
  DATE,
  // TINYINT,
  Instance,
  BOOLEAN
} from "sequelize";

interface IUser {
  //   openid?: string;
  nick_name?: string;
  password?: string;
  sex?: string;
  register_time?: Date;
  /**
   * 微信注册 00
   *
   */
  user_type?: string;
  photos?: string;
  update_time?: Date;
  user_name: string;

  user_id?: number;
  phone?: string;
  nation?: string;
  region: string;
  city: string;
  area: string;
  address: string;
}
type IUserInstance = Instance<IUser> & IUser;
// app/model/user.js

export let User = (database: Sequelize) => {
  const user = database.define<IUserInstance, IUser>("user", {
    user_id: { primaryKey: true, type: INTEGER, autoIncrement: true },
    user_name: { type: STRING, allowNull: false },
    nick_name: STRING,
    password: STRING,
    password_hash: STRING,
    id_card: STRING,
    phone: { type: STRING, allowNull: false },
    qq: { type: STRING },
    sex: STRING,
    role_id: INTEGER,
    nation: STRING,
    user_type: STRING,
    birthday: DATE,
    photos: STRING,
    marital: BOOLEAN,
    // native_place: STRING,
    education: STRING,

    id_card_addr: STRING,
    region: STRING,
    city: STRING,
    area: STRING,
    height: STRING,
    weight: STRING,
    address: STRING,
    speciality: STRING,
    description: STRING,
    headimgurl: STRING
  });

  return user;
};
