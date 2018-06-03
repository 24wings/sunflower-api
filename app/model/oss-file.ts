import { Sequelize, STRING, INTEGER, DATE, Instance } from "sequelize";


type IOssFileInstance = Instance<IOSSFile> & IOSSFile;

export let OSSFile = (database: Sequelize) => {
  const OSSFile = database.define<IOssFileInstance, IOSSFile>(
    "oss_file",
    {
      prefix: STRING,
      name: STRING,
      url: STRING,
      requestUrls: STRING,
      remotePort: INTEGER,
      rt: INTEGER,
      statusCode: INTEGER,
      status: INTEGER,
      remoteAddress: STRING,
      size: STRING,
      created_at: DATE,
      updated_at: DATE,
      shop_id: INTEGER
    },
    {
      underscored: true
    }
  );

  return OSSFile;
};
