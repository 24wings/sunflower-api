import { Sequelize, STRING, INTEGER, DATE, Instance } from "sequelize";

type IEmployeeInstance = Instance<IEmployee> & IEmployee;
export let Employee = (database: Sequelize) => {
  const employee = database.define<IEmployeeInstance, IEmployee>("employee", {
    shop_id: { type: INTEGER, allowNull: false },
    employee_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    department: STRING,
    job: STRING,
    name: STRING,
    nickname: STRING,
    role_code: INTEGER,
    telphone: STRING,
    phone: STRING,
    active_flg: INTEGER,
    qq: STRING,
    password: STRING,
    password_hash: STRING,
    shop_code: STRING,
    images: {
      type: STRING,
      get() {
        return (this as any).getDataValue("images")
          ? (this as any).getDataValue("images").split(",")
          : [];
      }
    },
    photo_path: STRING,

    male: STRING,
    nation: STRING,
    birthday: DATE,
    marital: STRING,
    native_place: STRING,
    sex: STRING,
    /**
     * 身份证号
     */
    id_card: STRING,
    email: STRING,
    referrer: STRING,
    id_card_addr: STRING,
    address: STRING,
    education_background: STRING,
    height: INTEGER,
    speciality: STRING,
    introducer: STRING,
    on_board: DATE,
    compensation: INTEGER,
    emergency_contact: STRING,
    emergency_contact_relationship: STRING,
    emergency_contact_phone: STRING,
    province: STRING,
    city: STRING,
    created_at: DATE,
    cent: INTEGER,
    level: INTEGER,
    service_id: STRING,
    service_flag: STRING,
    service_end_date: DATE,
    role_id: INTEGER
  });

  return employee;
};
