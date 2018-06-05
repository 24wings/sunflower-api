import {
  Sequelize,
  STRING,
  INTEGER,
  DATE,
  //   TINYINT,
  Instance
  //   BOOLEAN
} from "sequelize";
// import { any } from 'bluebird';

interface IRole {
  id?: number;
  shop_id: number;
  name?: string;
  modules_ids?: string;
}
type IRolenstance = Instance<IRole> & IRole;
// app/model/user.js

export let Role = (database: Sequelize) => {
  const role = database.define<IRolenstance, IRole>(
    "role",
    {
      shop_id: INTEGER,
      name: STRING,
      modules_ids: STRING,
      created_at: DATE,
      updated_at: DATE
    },
    { timestamps: true }
  );

  return role;
};
