import {
    Sequelize,
    STRING,
    INTEGER,
    //   DATE,
    //   TINYINT,
    Instance
    // BOOLEAN
} from "sequelize";
// import { any } from 'bluebird';

interface ICategroy {
    id?: number;
    name: string;
    images: string | string[];
    sort: number;

    created_at?: Date;
    updated_at?: Date;
}
type ICategroyInstance = Instance<ICategroy> & ICategroy;
// app/model/user.js

export let Categroy = (database: Sequelize) => {
    const categroy = database.define<ICategroyInstance, ICategroy>(
        "article_categroy",
        {
            name: STRING,
            images: STRING,
            sort: INTEGER,
            Images: STRING
        }
    );

    return categroy;
};