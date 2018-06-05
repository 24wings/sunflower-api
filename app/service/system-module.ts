import { Service } from "egg";
import db = require("../model");
import { Op, FindOptions } from "sequelize";
export default class extends Service {
  // async postUserAndModuleList(username, password) {
  //     let user = await db.user.findOne({ where: { username, password } });

  //     if (user) {
  //         let role = await db.role.findById(user["role_id"]);
  //         if (role) {
  //             let modules = await db.module.findAll({
  //                 where: { id: { $in: JSON.parse(role.modules_ids as string) } }
  //             });

  //             return { user, modules };
  //         } else {
  //             return { user, modules: [] };
  //         }
  //     } else {
  //         return "用户不存在";
  //     }
  // }

  async getModulePage(page = 0, pageSize = 10) {
    let list = await db.sunflower.query(
      `SELECT modules.name,modules.key_word,modules.parent_id ,modules.can_delete,  modules.module_id ,modules.link,modules.sort,modules.icon_font,m2.name 
      as parent FROM modules left join modules m2 on modules.parent_id = m2.module_id limit ${pageSize} offset ${page *
        pageSize} ;`
    );
    let total = await db.module.count();
    return { list: list[0], total };
  }
  getModuleAll() {
    return db.module.findAll();
  }
  createModule(newModule) {
    return db.module.create(newModule);
  }
  deleteModule(module_ids) {
    return db.module.destroy({ where: { id: module_ids } });
  }
  updateModule(module_id, module) {
    return db.module.update(module, { where: { id: module_id } });
  }
  findModule(keyword: string) {
    return db.module.findAll({
      where: {
        [Op.or]: [{ name: { $like: `%${keyword}%` } }, { id: keyword }]
      }
    });
  }
  async getRolePage(shop_id: number, page = 0, pageSize = 10) {
    return db.role.findAndCountAll({
      where: { shop_id },
      limit: 10,
      offset: page * pageSize
    });
  }

  createRole(newModule) {
    return db.role.create(newModule);
  }
  deleteRole(role_ids) {
    return db.role.destroy({ where: { id: role_ids } });
  }
  updateRole(role_id, role) {
    return db.role.update(role, { where: { id: role_id } });
  }
  findRole(keyword: string) {
    return db.role.findAll({
      where: {
        [Op.or]: [{ name: { $like: `%${keyword}%` } }, { id: keyword }]
      }
    });
  }
  async getUserList(page = 0, pageSize = 10) {
    let list = await db.user.findAll({
      limit: 10,
      offset: page * pageSize
    });
    let total = await db.user.count();
    return { total, list };
  }
  getRoleAll(shop_id: number) {
    return db.role.findAll({ where: { shop_id } });
  }
  async createUser(newUser) {
    return db.user.create(newUser);
  }
  deleteUser(user_ids) {
    return db.user.destroy({ where: { id: user_ids } });
  }
  updateUser(user, user_id) {
    console.log(user, user_id);
    return db.user.update(user, { where: { id: user_id } });
  }

  async GetArticlesPage(
    page: number = 0,
    pageSize = 10,
    option?: {
      keyword?: string;
      startTime?: Date;
      endTime?: Date;
      article_categroy_id?: number;
    }
  ) {
    page = Number.isInteger(page) ? page : parseInt(page as any);
    pageSize = Number.isInteger(pageSize)
      ? pageSize
      : parseInt(pageSize as any);

    let findOption: FindOptions<any> = {
      limit: pageSize,
      offset: page * pageSize,
      where: {}
    };

    // 特殊查找条件
    if (option) {
      if (option.keyword) {
        (findOption.where as any).title = { $like: `%${option.keyword}%` };
      }
      if (option.startTime || option.endTime) {
        let created_at: any = {};
        if (option.startTime) created_at.$gt = option.startTime;
        if (option.endTime) created_at.$lt = option.endTime;
        (findOption.where as any).created_at = created_at;
      }
      if (option.article_categroy_id) {
        (findOption.where as any).article_categroy_id =
          option.article_categroy_id;
      }
    }
    // console.log(option, (findOption as any)["where"]["created_at"]);

    let total = await db.article.findAndCount(findOption);
    total.rows.forEach(item => {
      item.images = (item.images as string).split(",");
    });
    return total;
  }

  async createArticles(newArticles) {
    return db.article.create(newArticles);
  }
  async deleteArticles(articles_ids) {
    return db.article.destroy({ where: { id: articles_ids } });
  }
  async updateArticles(articles, articles_id) {
    return db.article.update(articles, { where: { id: articles_id } });
  }
  async getArticleTypePage(page, pageSize) {
    let list = await db.articleCategory.findAll({
      limit: 10,
      offset: page * pageSize
    });
    list.forEach(item => {
      item.images = (item.images as string).split(",");
    });
    let total = await db.articleCategory.count();
    return { list, total };
  }
  async getArticleTypeAll() {
    return db.articleCategory.findAll();
  }
  async createCategroy(categroys) {
    return db.articleCategory.create(categroys);
  }

  async deleteCategroy(categroy_ids) {
    return db.articleCategory.destroy({ where: { id: categroy_ids } });
  }
  async updateCategroy(categroys, categroys_id) {
    return db.articleCategory.update(categroys, {
      where: { id: categroys_id }
    });
  }
  async getCommonPage() {
    return db.articleCategory.findAll();
  }
  async createCommon(commons) {
    return db.articleCategory.create(commons);
  }
  async recommandArticle(is_recommand, articles_id) {
    return db.article.update(
      { is_recommand },
      {
        where: { id: articles_id }
      }
    );
  }
  async passArticle(articles_id) {
    return db.article.update(
      { verify_status: db.VerifyStatus.okVerify },
      {
        where: { id: articles_id }
      }
    );
  }
  async refuseArticle(articles_id) {
    return db.article.update(
      { verify_status: db.VerifyStatus.failVerify },
      {
        where: { id: articles_id }
      }
    );
  }
}
