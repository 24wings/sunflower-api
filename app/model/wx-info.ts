import {
  Sequelize,
  STRING,
  INTEGER,
  // DATE,
  // TINYINT,
  Instance,
  // BOOLEAN
} from "sequelize";

interface IWxUser {
  user_id: number,
  openid: string;
  nickname: string;
  sex: string;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string | string[];
  unionid: string;
  created_at: Date;
  update_at: Date;
}
type IWxUserInstance = Instance<IWxUser> & IWxUser;
// app/model/user.js

export let WxInfo = (database: Sequelize) => {
  const wxInfo = database.define<IWxUserInstance, IWxUser>(
    "wx_info",
    {

      user_id: INTEGER,
      openid: STRING,
      nickname: STRING,
      sex: STRING,
      province: STRING,
      city: STRING,
      country: STRING,
      headimgurl: STRING,
      privilege: STRING,
      unionid: STRING,
    }
  );

  return wxInfo;
};
