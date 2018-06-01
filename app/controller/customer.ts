import { Controller } from "egg";
import db = require('../model');

export default class Customer extends Controller {
    /**get请求 */
    async getQrcode() {
        let { ctx } = this;
        let { type } = ctx;
        if (!type) type = "base64";

        let url: string;
        if (ctx.method.toLowerCase() == "get") {
            url = ctx.query.url;
        } else {
            url = ctx.request.body.url;
        }
        let data = await this.service.qrcode.urlToQrcode(url, type as any);
        ctx.body = { ok: true, data, prefix: "data:image/png;base64," };
    }
    /***
     * 微信获取jssdk ticket
     *
     */
    async getTicket() {
        let { ctx } = this;
        let { url } = ctx.query;
        let ticket = await this.service.wechat.getTicket(url, false);
        // console.log(ticket);
        ctx.body = { ok: true, data: ticket };
    }
    /**
     * 上传base64图片
     *
     */
    async uploadBase64() {
        let { ctx } = this;
        let { base64 } = ctx.request.body;
        let result = await ctx.service.oss.uploadImage(base64);
        ctx.body = { ok: true, data: result };
    }

    async getHome() {
        let { ctx } = this;
        let { reward_value, material_id } = ctx.query;
        let material = await db.materialModel.findById(material_id);
        await this.ctx.render("index", { reward_value, material });
    }
    async getAppWebsite() {
        let { ctx } = this;
        let { appName } = ctx.query;
        ctx.redirect(appName);
    }
    async checkWechat() {
        const { ctx } = this;
        ctx.body = ctx.query.echostr;
    }
    public async index() {
        const { ctx } = this;

        let { code, material_id } = ctx.query;

        let material = await db.materialModel.findById(material_id);

        console.log(material_id, material);
        if (!code) {
            console.error("没有code");
        }
        let weUser: any = {};
        if (code) {
            weUser = await ctx.service.wechat.getWechatUserByCode(code);
            if (!weUser) weUser = {};
        } else {
            weUser = {};
        }
        console.log(`weUser:`, weUser);
        if (weUser) {
            if (material) {
                let result = await db.sunflower
                    .query(` SELECT user.user_name,coupon_real.coupon_name FROM coupon_real
            left join customer.materials on coupon_real.coupon_id= customer.materials.coupon_id 
            left join m2centraldb.user on user.user_id = m2centraldb.coupon_real.shop_id
           where coupon_real.shop_id = ${material.shopuser_id} `);
                let openIdWxUser = await db.wxUserModel.findOne({
                    where: { openid: weUser.openid }
                });
                if (result[0]) {
                    console.log(result[0][0]);
                    let titleMeta = result[0][0];
                    await this.ctx.render("index", {
                        title: titleMeta.user_name + titleMeta.coupon_name,
                        material,
                        weUser,
                        openid: weUser.openid,
                        autoLogin: openIdWxUser
                    });
                } else {
                    await this.ctx.render("index", {
                        material,
                        weUser,
                        openid: weUser.openid
                    });
                }
            } else {
                await this.ctx.render("index", {
                    material,
                    weUser,
                    openid: weUser.openid
                });
            }
        } else {
            ctx.body = { ok: false, data: "授权失败" };
        }
    }
    async getAuthUrl() {
        let { ctx } = this;

        await ctx.redirect(
            ctx.service.wechat.getOauthUrl(
                "/?material_id=" +
                ctx.query.material_id +
                (ctx.query.shareuser_id
                    ? `&shareuser_id=${ctx.query.shareuser_id}`
                    : "")
            )
        );
    }
    async uploadBase64Test() {
        let { ctx } = this;
        let { base64 } = ctx.request.body;
        let result = await ctx.service.oss.uploadImage(base64);
        ctx.body = result;
    }
    async getImage() {
        let { ctx } = this;
        let name = ctx.query.name;
        ctx.body = await ctx.service.oss.getImage(name, "");
    }
    async sendAuthCode() {
        let { ctx } = this;
        if (this.service.common.regexp.phone.test(ctx.query.phone)) {
            await ctx.service.alidayu.sendUserRegisiterAuthCode(ctx.query.phone);
            ctx.body = { ok: true };
        } else {
            ctx.body = { ok: false, data: "不合法的手机号" };
        }
    }
    async signup() {
        // let { ctx } = this;
        // let {
        //     phone,
        //     authcode,
        //     material_id,
        //     shareuser_id,
        //     openid,
        //     nickname,
        //     sex,
        //     // shareurl,
        //     language,
        //     city,
        //     province,
        //     country,
        //     headimgurl,
        //     privilege
        // } = ctx.request.body;

        // privilege = [];
        // /**
        //  *
        //  *  1.查找基本资料,素材,手机用户
        //  *  2. 手机用户是否已经成为邦为用户(user)
        //  *  3. 若该手机号已经成为邦为用户,则查看是否是该店铺的微信用户,若没有成为邦为用户,则查看是否是该店铺的微信用户
        //  *  4. 若是该店铺的用户,不分发奖券,若不是该店铺用户,则分发奖券
        //  *
        //  *
        //  */
        // let material = await db.materialModel.findById(material_id);
        // let user: any;
        // user = await db.userModel.findOne({ where: { mobi: phone } });
        // if (material) {
        //     if (this.service.common.regexp.phone.test(phone) && phone) {
        //         // 1. 判断openid 有没有该wx_user ,没有则创建 user_id
        //         var newWxUser: any;

        //         let openIdWxUser = await db.wxUserModel.findOne({
        //             where: { phone, signup_shop_id: material.shopuser_id }
        //         });

        //         console.log(phone, authcode);
        //         var openIdUser;
        //         console.log(openIdUser);
        //         let newUser;

        //         // 若没有opeIdUser 创建先创建user 其次创建 wxUser
        //         if (!openIdWxUser) {
        //             console.log(phone, authcode);
        //             // let ok = await this.service.alidayu.queryDetail(phone, authcode);
        //             let ok = true;
        //             ok = true;
        //             if (!ok) {
        //                 console.log(`ssssssssssssssssssss错误`);
        //                 return (ctx.body = { ok: false, data: "验证码不正确" });
        //             }
        //             let newId = await db.sunflower.query(
        //                 `select new_id('user_shop') as VAL limit 1`
        //             );
        //             newId = newId[0][0].VAL;
        //             console.log(`newId:`, newId);

        //             if (!user) {
        //                 newUser = await db.userModel.create({
        //                     user_id: newId,
        //                     user_name: nickname ? nickname : "微信用户",
        //                     nick_name: nickname,
        //                     sex: "1",
        //                     photos: headimgurl,
        //                     mobi: phone,
        //                     // nation: country,
        //                     password: "123456"
        //                 });
        //             }
        //             if (!openIdWxUser) {
        //                 // 2. 判断有没有shop_id 和openid 联合起来的店铺
        //                 newWxUser = await db.wxUserModel.create({
        //                     phone,
        //                     password: "123456",
        //                     openid,
        //                     nickname,
        //                     sex,
        //                     user_id: user.user_id,
        //                     language,
        //                     live_city: city,
        //                     live_province: province,
        //                     nation: country,
        //                     photos: headimgurl,
        //                     privilege: privilege.join(","),
        //                     signup_shop_id: material.shopuser_id
        //                 });
        //             }
        //             // newWxUser = openIdUser;
        //         } else {
        //             if (openIdWxUser) {
        //                 openIdUser = await db.userModel.findOne({
        //                     where: { user_id: openIdWxUser.user_id }
        //                 });
        //             }
        //         }
        //         let openidShopWxUser = await db.wxUserModel.findOne({
        //             where: { signup_shop_id: material.shopuser_id, openid }
        //         });
        //         // 若没有,则注册, 有则直接进入下个页面
        //         if (!openidShopWxUser) {
        //             await db.wxUserModel.create({
        //                 phone,
        //                 password: "123456",
        //                 openid,
        //                 nickname,
        //                 sex,
        //                 user_id: user.user_id,
        //                 language,
        //                 live_city: city,
        //                 live_province: province,
        //                 nation: country,
        //                 photos: headimgurl,
        //                 privilege: privilege.join(","),
        //                 signup_shop_id: material.shopuser_id
        //             });
        //         } else {
        //             ctx.body = { ok: true, data: openIdWxUser, msg: "拥有微信用户" };
        //         }
        //         if (newWxUser) {
        //             if (newWxUser.user_id) {
        //                 // 分配奖金
        //                 console.log(`新注册了用户,开始分配奖金`, newUser);

        //                 let material: any = await db.materialModel.findById(material_id);
        //                 let shareResults;
        //                 let regGiveResults;
        //                 if (material) {
        //                     let rule = await db.couponRuleRealModel.findOne({
        //                         where: {
        //                             shop_id: material.shopuser_id,
        //                             coupon_id: material.coupon_id
        //                         }
        //                     });
        //                     // console.log(`rule`, rule);
        //                     if (rule) {
        //                         console.log(`分配rule,`, rule);
        //                         // if (rule.can_share == 1 && shareuser_id) {
        //                         console.log(`分享分配`);
        //                         let shareUser = await db.wxUserModel.findOne({
        //                             where: { user_id: shareuser_id }
        //                         });
        //                         // 额外分享分配
        //                         if (shareUser) {
        //                             console.log(
        //                                 `====================================================额外分享=====================================================`
        //                             );
        //                             shareResults = await this.service.coupon.giveUserCoupons(
        //                                 material.coupon_id,
        //                                 material.shopuser_id,
        //                                 shareuser_id,
        //                                 shareUser.user_name || (user.nick_name as string),
        //                                 shareUser.phone as string,
        //                                 1
        //                             );
        //                         }

        //                         // 必定注册分配
        //                         regGiveResults = await this.service.coupon.giveUserCoupons(
        //                             material.coupon_id,
        //                             material.shopuser_id,
        //                             newWxUser.user_id,
        //                             user.nick_name || (user.user_name as string),
        //                             phone,
        //                             0
        //                         );
        //                         let firstRule = await db.couponRealModel.findOne({
        //                             where: {
        //                                 coupon_id: regGiveResults[0].coupon_id,
        //                                 shop_id: material.shopuser_id
        //                             }
        //                         });
        //                         ctx.body = {
        //                             ok: true,
        //                             data: user,
        //                             isRedpack:
        //                                 regGiveResults || shareResults
        //                                     ? (regGiveResults || shareResults).length > 0
        //                                     : false,
        //                             msg: "注册成功,有红包礼金",
        //                             readPacks: regGiveResults,
        //                             rule: firstRule
        //                         };
        //                     } else {
        //                         ctx.body = { ok: false, data: "未知的错误" };
        //                     }
        //                 } else {
        //                     ctx.body = { ok: true, data: openIdWxUser, msg: "素材尚未找到" };
        //                 }
        //             } else {
        //                 ctx.body = { ok: true, data: openIdWxUser, msg: "并没有找到用户" };
        //             }
        //         }
        //     } else {
        //         ctx.body = { ok: false, data: "手机号不合法" };
        //     }
        // } else {
        //     ctx.body = { ok: false, data: "信息不完善" };
        // }

    }
    async signup2() {
        // let { ctx } = this;
        // let {
        //     phone,
        //     // authcode,
        //     material_id,
        //     shareuser_id,
        //     openid,
        //     nickname,
        //     sex,
        //     // shareurl,
        //     language,
        //     city,
        //     province,
        //     country,
        //     headimgurl,
        //     privilege
        // } = ctx.request.body;

        // privilege = [];
        // /**
        //  *
        //  *  1.查找基本资料,素材,手机用户
        //  *  2. 手机用户是否已经成为邦为用户(user)
        //  *  3. 若该手机号已经成为邦为用户,则查看是否是该店铺的微信用户,若没有成为邦为用户,则先创建用户,然后查看是否是该店铺的微信用户
        //  *  4. 若是该店铺的用户,不分发奖券,若不是该店铺用户,则创建用户,分发奖券
        //  *
        //  *
        //  */
        // let material = await db.materialModel.findById(material_id);
        // let user: any;
        // let newWxUser: any;
        // user = await db.userModel.findOne({ where: { mobi: phone } });
        // if (material) {
        //     if (this.service.common.regexp.phone.test(phone) && phone) {
        //         // let ok = await this.service.alidayu.queryDetail(phone, authcode);
        //         let ok = true;
        //         ok = true;
        //         if (ok) {
        //             //2. 手机用户是否已经成为邦为用户(user)
        //             if (!user) {
        //                 let newId = await db.sunflower.query(
        //                     `select new_id('user_shop') as VAL limit 1`
        //                 );
        //                 newId = newId[0][0].VAL;
        //                 console.log(`newId:`, newId);
        //                 user = await db.userModel.create({
        //                     user_id: newId,
        //                     user_name: nickname ? nickname : "微信用户",
        //                     nick_name: nickname,
        //                     sex: "1",
        //                     photos: headimgurl,
        //                     mobi: phone,
        //                     // nation: country,
        //                     password: "123456"
        //                 });
        //             }
        //             let wxUser = await db.wxUserModel.findOne({
        //                 where: { phone, signup_shop_id: material.shopuser_id }
        //             });
        //             if (!wxUser) {
        //                 newWxUser = await db.wxUserModel.create({
        //                     phone,
        //                     password: "123456",
        //                     openid,
        //                     nickname,
        //                     sex,
        //                     user_id: user.user_id,
        //                     language,
        //                     live_city: city,
        //                     live_province: province,
        //                     nation: country,
        //                     photos: headimgurl,
        //                     privilege: privilege.join(","),
        //                     signup_shop_id: material.shopuser_id
        //                 });
        //             }
        //         } else {
        //             return (ctx.body = { ok: false, data: "验证码不正确" });
        //         }
        //         if (newWxUser) {
        //             if (newWxUser.user_id) {
        //                 // 分配奖金
        //                 console.log(`新注册了用户,开始分配奖金`, newWxUser);

        //                 let material: any = await db.materialModel.findById(material_id);
        //                 let shareResults;
        //                 let regGiveResults;
        //                 if (material) {
        //                     let rule = await db.couponRuleRealModel.findOne({
        //                         where: {
        //                             shop_id: material.shopuser_id,
        //                             coupon_id: material.coupon_id
        //                         }
        //                     });
        //                     // console.log(`rule`, rule);
        //                     if (rule) {
        //                         console.log(`分配rule,`, rule);
        //                         // if (rule.can_share == 1 && shareuser_id) {
        //                         console.log(`分享分配`);
        //                         let shareUser = await db.wxUserModel.findOne({
        //                             where: { user_id: shareuser_id }
        //                         });
        //                         // 额外分享分配
        //                         if (shareUser) {
        //                             console.log(
        //                                 `====================================================额外分享=====================================================`
        //                             );
        //                             shareResults = await this.service.coupon.giveUserCoupons(
        //                                 material.coupon_id,
        //                                 material.shopuser_id,
        //                                 shareuser_id,
        //                                 shareUser.user_name || (user.nick_name as string),
        //                                 shareUser.phone as string,
        //                                 1
        //                             );
        //                         }
        //                         // 必定注册分配
        //                         regGiveResults = await this.service.coupon.giveUserCoupons(
        //                             material.coupon_id,
        //                             material.shopuser_id,
        //                             newWxUser.user_id,
        //                             user.nick_name || (user.user_name as string),
        //                             phone,
        //                             0
        //                         );
        //                         let firstRule = await db.couponRealModel.findOne({
        //                             where: {
        //                                 coupon_id: regGiveResults[0].coupon_id,
        //                                 shop_id: material.shopuser_id
        //                             }
        //                         });
        //                         ctx.body = {
        //                             ok: true,
        //                             data: user,
        //                             isRedpack:
        //                                 regGiveResults || shareResults
        //                                     ? (regGiveResults || shareResults).length > 0
        //                                     : false,
        //                             msg: "注册成功,有红包礼金",
        //                             readPacks: regGiveResults,
        //                             rule: firstRule
        //                         };
        //                     } else {
        //                         ctx.body = { ok: false, data: "未知的错误" };
        //                     }
        //                 } else {
        //                     ctx.body = {
        //                         ok: true,
        //                         data: user,
        //                         msg: "素材尚未找到"
        //                     };
        //                 }
        //             } else {
        //                 ctx.body = {
        //                     ok: true,
        //                     data: user,
        //                     msg: "并没有找到用户"
        //                 };
        //             }
        //         } else {
        //             ctx.body = { ok: true, data: user, msg: "正常登陆" };
        //         }
        //     } else {
        //         ctx.body = { ok: false, data: "手机号不合法" };
        //     }
        // } else {
        //     ctx.body = { ok: false, data: "信息不完善" };
        // }

        // console.log(`body:`, ctx.body);
    }

    async createMaterial() {
        let { ctx } = this;
        console.log(ctx.request.body);
        let {
            shopuser_id,
            home_image_url,
            ticket_image_url,
            share_image_url,

            coupon_id
        } = ctx.request.body;
        console.log(`create_material`, ctx.request.body);

        if (shopuser_id) {
            let shopuser = await db.shopModel.findOne({
                where: { shop_id: shopuser_id }
            });
            if (shopuser) {
                let exist = await db.materialModel.findOne({
                    where: { shopuser_id, coupon_id }
                });
                if (!exist) {
                    let newMaterial = await db.materialModel.create({
                        coupon_id,
                        shop_phone: shopuser.telphone,
                        shopuser_id,
                        home_image_url,
                        ticket_image_url,
                        share_image_url
                    });
                    ctx.body = { ok: true, data: newMaterial };
                } else {
                    let update = await db.materialModel.update(
                        { home_image_url, ticket_image_url, share_image_url },
                        { where: { shopuser_id, coupon_id } }
                    );
                    ctx.body = { ok: true, data: update };
                }
            } else {
                ctx.body = { ok: false, data: "未知的商户" };
            }
        } else {
            ctx.body = { ok: false, data: "缺少参数" };
        }
    }
    async getMaterial() {
        let { ctx } = this;
        let { material_id } = ctx.query;

        if (material_id) {
            let material = await db.materialModel.findById(material_id);

            if (material) {
                let user = await db.userModel.findOne({
                    where: { user_id: material.shopuser_id }
                });
                let shopuser = await db.shopModel.findOne({
                    where: { shop_id: material.shopuser_id }
                });

                ctx.body = {
                    ok: true,
                    data: {
                        material,
                        shopuser,
                        user,

                        shop_id: material.shopuser_id,
                        coupon_id: material.coupon_id
                    }
                };
            } else {
                ctx.body = { ok: false, data: `未知的素材` };
            }
        } else {
            ctx.body = { ok: false, data: "" };
        }
    }
    async updateMaterial() {
        let { ctx } = this;
        let { material_id } = ctx.query;
        let body = ctx.request.body;
        if (material_id) {
            let material = await db.materialModel.findById(material_id);
            if (material) {
                await db.materialModel.update(body);
                ctx.body = { ok: true, data: "更新成功" };
            } else {
                ctx.body = { ok: false, data: "未知的素材" };
            }
        } else {
            ctx.body = { ok: false, data: "缺少参数 material_id" };
        }
    }
    async listMaterial() {
        let { ctx } = this;
        let { shop_id } = ctx.query;
        if (shop_id) {
            let materials = await this.service.coupon.getCouponAndMaterialByShopId(
                shop_id
            );
            /**
             *  await db.materialModel.findAll({
              where: { shopuser_id: shop_id }
            });
             */
            ctx.body = { ok: true, data: materials };
        } else {
            ctx.body = { ok: false, data: "参数缺省" };
        }
    }
    async getShopTickets() {
        let { ctx } = this;
        let { shop_id, size } = ctx.query;
        if (size) {
            size = parseInt(size);
        } else {
            size = 100;
        }
        if (shop_id && size) {
            let tickets = await db.couponClaimModel.findAll({
                where: { shop_id, is_sync: false },
                limit: size
            });
            ctx.body = { ok: true, data: tickets };
        } else {
            ctx.body = { ok: false, data: "参数不全" };
        }
    }
    async getTciketsByKeyword() {
        let { ctx } = this;
        let { keyword, shop_id } = ctx.query;
        if (keyword && shop_id) {
            // ctx.my
            let data: any = await ctx.app.mysql
                .get("customer")
                .query(
                    `SELECT * FROM  coupon_claim left JOIN m2centraldb.user user on  coupon_claim.member_id = user.user_id  where user.user_id like '%${keyword}%' or  user.mobi like '%${keyword}%' and  coupon_claim.shop_id=${shop_id}`
                );
            let claimIds = (data as any[]).map(claim => claim.claim_id);
            console.log(`claimIdS:`, claimIds);
            let claims = await db.couponClaimModel.findAll({
                where: {
                    claim_id: {
                        $in: claimIds
                    }
                }
            });
            let users = await db.userModel.findAll({
                where: {
                    user_id: {
                        $in: (data as any).map(claim => claim.member_id)
                    }
                }
            });

            ctx.body = { ok: true, data: { claims, users } };
        } else {
            if (!keyword) {
                // ctx.my
                let data: any = await ctx.app.mysql
                    .get("customer")
                    .query(
                        `SELECT * FROM  customer.coupon_claim coupon_claim left JOIN m2centraldb.user user on  coupon_claim.member_id = user.user_id  where  coupon_claim.shop_id=${shop_id}  limit 10`
                    );
                let claimIds = (data as any[]).map(claim => claim.claim_id);
                console.log(`claimIdS:`, claimIds);
                let claims = await db.couponClaimModel.findAll({
                    where: {
                        claim_id: {
                            $in: claimIds
                        }
                    }
                });
                let users = await db.userModel.findAll({
                    where: {
                        user_id: {
                            $in: (data as any).map(claim => claim.member_id)
                        }
                    }
                });

                ctx.body = { ok: true, data: { claims, users } };
            } else {
                ctx.body = { ok: false, data: "参数不合法" };
            }
        }
    }
    async syncTicketsData() {
        let { shop_id } = this.ctx.query;
        let { had_sync_ids } = this.ctx.request.body;
        if (!had_sync_ids) had_sync_ids = [];

        let claims = await db.couponClaimModel.findAll({
            where: {
                shop_id,
                claim_id: {
                    $notIn: had_sync_ids
                }
            }
        });
        this.ctx.body = { ok: true, data: claims };
    }
    async syncTicketsDataComplete() {
        let { ctx } = this;
        let { shop_id } = ctx.query;
        let { completeIds } = ctx.request.body;
        if (!completeIds) completeIds = [];
        let update = await db.couponClaimModel.update(
            { is_sync: true },
            {
                where: {
                    shop_id,
                    claim_id: {
                        $in: completeIds
                    }
                }
            }
        );
        ctx.body = { ok: true, data: update };
    }
    message() {
        let { ctx } = this;
        console.log(ctx.request.body, ctx.query);
    }
    async sendShopAuthCode() {
        let { ctx } = this;
        let { material_id, phone } = this.ctx.query;
        console.log(material_id, phone);
        let material = await db.materialModel.findById(material_id);
        if (material) {
            let shopSmsInfo = await db.smsInfoModel.findOne({
                where: { shop_id: material.shopuser_id }
            });
            if (shopSmsInfo) {
                if (shopSmsInfo.sms_surplus >= 1) {
                    if (this.service.common.regexp.phone.test(ctx.query.phone)) {
                        let result = await ctx.service.alidayu.sendUserRegisiterAuthCode(
                            ctx.query.phone
                        );
                        let detail = await ctx.service.alidayu.queryDetailByBizId(
                            phone
                            // result.BizId
                        );

                        console.log(
                            result,
                            detail,
                            detail.SmsSendDetailDTOs.SmsSendDetailDTO
                        );
                        await db.smsRecordModel.create({
                            mobilenum: phone,
                            shop_id: material.shopuser_id,
                            msg: `您的注册验证码为:${
                                result.OutId
                                },该验证码5分钟内有效，请勿泄漏与他人。'`,
                            time:
                                new Date().format("yyyyMMDDhhmmss") +
                                new Date().format("yyyyMMddhhmmss") +
                                new Date().getMilliseconds(),
                            type: 8
                        });
                        // 扣费
                        await this.service.alidayu.lessShopSurplus(
                            material.shopuser_id as number
                        );
                        ctx.body = { ok: true };
                    } else {
                        ctx.body = { ok: false, data: "不合法的手机号" };
                    }
                } else {
                    ctx.body = { ok: false, data: "商户短信余额不足,请及时充值" };
                }
            } else {
                ctx.body = { ok: false, data: "商户短信服务尚未开辟" };
            }
        } else {
            ctx.body = { ok: false, data: "未知的素材" };
        }
    }
    async isOpenidLogin() {
        let { ctx } = this;
        if (ctx.query.openid) {
            let wxUser = await db.wxUserModel.findOne({
                where: { openid: ctx.query.openid }
            });
            console.log(`isWxUserlogin`, !!wxUser, wxUser);
            ctx.body = { ok: !!wxUser, data: wxUser ? wxUser : "不能直接登录" };
        } else {
            ctx.body = { ok: false, data: "不能直接登录" };
        }
    }
}