import {
    Sequelize,
    STRING,
    INTEGER,
    DATE,
    //   TINYINT,
    Instance
    // BOOLEAN
} from "sequelize";
// import { any } from 'bluebird';

interface IComment {
    id: number;
    user_nick_name: string;
    contant: string;
    created_at: Date;
    updated_at: Date;
    parent_id: number;
    ariticle_id: number;
}
type ICommentInstance = Instance<IComment> & IComment;
// app/model/user.js

export let Comment = (database: Sequelize) => {
    const comment = database.define<ICommentInstance, IComment>("comment", {
        id: { type: INTEGER, primaryKey: true },
        user_nick_name: STRING,
        contant: STRING,
        created_at: DATE,
        updated_at: DATE,
        parent_id: INTEGER,
        ariticle_id: INTEGER
    });

    return comment;
};