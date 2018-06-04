import { Sequelize, STRING, INTEGER, DATE, Instance, TINYINT } from "sequelize";

// app/model/user.js

interface IModule {

    module_id: number;
    name: string;
    parent_id;
    created_at: Date;
    updated_at: Date;
    user_module_name: string;
    key_word: string;
    link: string;
    sort: number;
    icon_font: string;
    can_delete: boolean;


}
type IModuleInstance = Instance<IModule> & IModule;

export let Module = (database: Sequelize) => {
    const ModuleModel = database.define<IModuleInstance, IModule>(
        "module",
        {
            module_id: { type: INTEGER, primaryKey: true, allowNull: false },
            name: { type: STRING, allowNull: false },
            parent_id: { type: STRING, allowNull: false },
            created_at: { type: DATE },
            updated_at: { type: DATE },
            user_module_name: { type: STRING },
            key_word: { type: STRING },
            link: { type: INTEGER },
            sort: INTEGER,
            icon_font: STRING,
            can_delete: TINYINT,
        }
    );

    return ModuleModel;
};
