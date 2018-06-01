using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using basewe.M2.central.SMS.Core.Profile;
using basewe.M2.central.SMS.Core;
using basewe.M2.central.SMS.Dysmsapi.Model.V20170525;
using basewe.M2.central.SMS.Core.Exceptions;

namespace basewe.M2.central.SMS.SMSSend
{
    public class ShortMessage
    {
        public static int Send(string num,int type,List<string> list,int shop_id,string passwd,string outid)
        {
            String product = "Dysmsapi";//短信API产品名称
            String domain = "dysmsapi.aliyuncs.com";//短信API产品域名
            String accessKeyId = "LTAIwItdPKtaGFo6";//你的accessKeyId
            String accessKeySecret = "mwWHkKrkoYr7QxdH1Txuan2eRWj1OD";//你的accessKeySecret

            IClientProfile profile = DefaultProfile.GetProfile("cn-hangzhou", accessKeyId, accessKeySecret);
            DefaultProfile.AddEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
            IAcsClient acsClient = new DefaultAcsClient(profile);
            SendSmsRequest request = new SendSmsRequest();
            try
            {
                //必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为20个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式
                request.PhoneNumbers = num;
                //必填:短信签名-可在短信控制台中找到
                request.SignName = "众合致胜";
                switch (type)
                {
                    case 1:
                        //密码找回
                        //您在${shop}的账户${customer}，密码${passwd}，余额${balance}，请妥善保管，详情请致电商铺。
                        //必填:短信模板-可在短信控制台中找到
                        if (list.Count != 4) return -3;
                        request.TemplateCode = "SMS_90275069";
                        //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\",\"passwd\":\"" + list[2] + "\",\"balance\":\"" + list[3] + "\"}";
                        break;
                    case 2:
                        //会员消费记录
                        //您在${shop}开设的${customer}账户当前时间完成支付${consume}，余额${balance}，详情请致电商铺
                        if (list.Count != 4) return -4;
                        request.TemplateCode = "SMS_90625003";
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\",\"consume\":\"" + list[2] + "\",\"balance\":\"" + list[3] + "\"}";
                        break;
                    case 3:
                        //会员卡续充
                        //您在${shop}开设的${customer}账户当前时间续充${consume}，余额${balance}，详情请致电商铺
                        if (list.Count != 4) return -5;
                        request.TemplateCode = "SMS_92825015";
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\",\"consume\":\"" + list[2] + "\",\"balance\":\"" + list[3] + "\"}";
                        break;
                    case 4:
                        //会员卡密码修改成功
                        //您在${shop}开设的${customer}账户当前时间密码修改成功，详情请致电商铺
                        if (list.Count != 2) return -6;
                        request.TemplateCode = "SMS_92870008";
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\"}";
                        break;
                    case 5:
                        //会员卡转款
                        //SMS_92855015  您在${shop}开设的${customer}账户当前时间转款给${custo}，余额${balance}，详情请致电商铺  
                        if (list.Count != 4) return -7;
                        request.TemplateCode = "SMS_93225001";
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\",\"custo\":\"" + list[2] + "\",\"balance\":\"" + list[3] + "\"}";
                        break;
                    case 6:
                        //会员卡清零
                        //您在${shop}开设的${customer}账户当前时间被清零，详情请致电商铺
                        if (list.Count != 2) return -8;
                        request.TemplateCode = "SMS_92980011";
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\"}";
                        break;
                    case 7:
                        //会员开卡
                        //您当前时间开设的${customer}账户，充值余额为${balance}，详情请致电商铺
                         if (list.Count != 3) return -9;
                         request.TemplateCode = "SMS_92830012";
                         request.TemplateParam = "{\"customer\":\"" + list[0]+list[1] + "\",\"balance\":\"" + list[2] + "\"}";
                        break;
                    case 8:
                        //会员注册
                        //您的注册验证码为:${code},该验证码5分钟内有效，请勿泄漏与他人。
                        if (list.Count != 1) return -10;
                        request.TemplateCode = "SMS_120376411";
                        request.TemplateParam = "{\"code\":\"" + list[0] + "\"}";
                        break;
                    case 9:
                        //代金券发放
                        //尊敬的会员${customer}，${shop}赠送您一张${amount}元的代金券，有效期：${validdate}。
                        if (list.Count != 4) return -11;
                        request.TemplateCode = "SMS_121912058";
                        request.TemplateParam = "{\"customer\":\"" + list[0] + "\",\"shop\":\"" + list[1] + "\",\"amount\":\"" + list[2] + "\",\"validdate\":\"" + list[3] + "\"}";
                        break;
                    case 10:
                        //代金券使用
                        //尊敬的会员${customer}，您在${shop}使用了代金券${couponname}。
                        if (list.Count != 3) return -12;
                        request.TemplateCode = "SMS_121857042";
                        request.TemplateParam = "{\"customer\":\"" + list[0] + "\",\"shop\":\"" + list[1] + "\",\"couponname\":\"" + list[2] + "\"}";
                        break;
                    case 11:
                        if (list.Count != 3) return -13;
                        request.TemplateCode = "SMS_130914712";
                        request.TemplateParam = "{\"shop\":\"" + list[0] + "\",\"customer\":\"" + list[1] + "\",\"code\":\"" + list[2] + "\"}";
                        break;
                    default:
                        return -99;
                        break;
                }
                //可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
                request.OutId = outid;
                //请求失败这里会抛ClientException异常
                SendSmsResponse sendSmsResponse = acsClient.GetAcsResponse(request);

                System.Console.WriteLine(sendSmsResponse.Message);


            }
            catch (ServerException e)
            {
                System.Console.WriteLine("Hello World!");
                return -1;
            }
            catch (ClientException e)
            {
                System.Console.WriteLine("Hello World!");
                return -2;
            }
            return 1;
        }
    }
}
