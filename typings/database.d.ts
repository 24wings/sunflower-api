/**
 * 阿里云上传的图片数据库结构
 */
interface IOSSFile {
  /**自定义 bucket 名字 */
  prefix?: string;
  bucket?: string;
  name?: string;
  url?: string;
  requestUrls?: string[];
  remotePort?: number;
  rt?: number;
  statusCode?: number;
  status?: number;
  remoteAddress?: string;
  size: number;
  shop_id?: number;
}

interface IEmployee {
  shop_id: number;
  role_id: number;
  employee_id?: number;
  department: string;
  job: string;
  name;
  /*** 昵称*/
  nickname?;
  /*** 角色code*/
  role_code?;
  /*** 固定电话*/
  telphone?;
  id_card: string;
  id_card_addr: string;
  /*** 手机号码*/
  phone;
  /*** 激活标志,1为正常会员注册激活标识，100以上为平台使用，101为平台雇佣推广人员*/
  active_flg?;
  /**
   * 性别 1男 2女
   */
  sex: string;
  qq?: string;
  /**
   * 邮箱
   */
  email?: string;
  password?: string;
  password_hash?: string;
  /**
   * 员工编号
   */
  shop_code?: string;
  /**
   * 头像照片
   */
  images?: string | string[];
  /**
   * 照片路径
   */
  photo_path?: string;
  id_card?: string;
  /**
   * 1男 2女
   *
   */
  male?: string;
  /**
   * 民族
   **/
  nation?: string;

  birthday?: Date;
  /**
   * 婚否
   */
  marital?: 0 | 1 | true | false;
  native_place?: string;
  /**
   * 身份证地址
   */
  id_card_addr?: string;
  /**
   * 现住址
   */
  address?: string;
  /**
   * 学历
   */
  education_background?: string;
  /**
   * 身高
   */
  height?: number;
  /**
   * 特长
   */
  speciality?: string;
  /**
   * 介绍人
   */
  introducer?: string;
  /**
   * 入职时间
   */
  on_board?: Date;
  /**
   * 基本薪资
   */
  compensation?: number;
  /**
   * 紧急联系人姓名
   */
  emergency_contact: string;
  /**
   * 紧急联系人关系
   */
  emergency_contact_relationship: string;
  /**
   * 紧急联系人电话
   */
  emergency_contact_phone: string;
  province: string;
  city?: string;
  cent?: string;
  level?: string;
  service_id?: string;
  service_flag?: string;
  service_end_date?: Date;
  created_at?: Date;
  update_at?: Date;
}
/**
 * 商户
 */
interface IShop {
  shop_id?: number;
  shop_name?: string;
  telphone?: string;
  boss_mobi?: string;
  qq?: string;
  phone?: string;
  password?: string;
  /**
   * 省份
   */
  region?: string;
  /**
   * 市
   */
  city?: string;
  /**
   * 区
   */
  addr?: string;

  /**
   * 推荐人id
   */
  referrer?: string;
  /**服务人ID */
  servicer?: string;
  /**是否激活 激活就是安装 */
  active_status?: string;
  active_time?: Date;
  /**
   * 法人姓名
   */
  legal_person_name?: string;
  /**
   * 法人手机号
   */
  legal_person_mobi?: string;
  boss_name?: string;
  boss_mobi?: string;
  /**
   * 店长名字
   */
  manager_name?: string;
  /**
   * 店长手机
   */
  manager_mobi?: string;
  area_size?: number;
  rooms?: number;
  /**
   * 技师数
   */
  skillers?: number;
  /**
   * 分店数
   */
  branches?: number;
  /**
   * 加盟店数
   */
  franchies?: number;
  pictures?: string;
  introduction?: string;
  open_date?: Date;
  /**
   * 经纬度
   */
  lat_lng?: string;
  update_at?: Date;
  created_at?: Date;
}

/**
 * 商户子订单记录
 */
interface ISubOrderReal {
  sub_order_id;
  order_id;
  room_id;
  payed_flg;
  staff_id;
  staff_male;
  hand_card_id;
  sub_order_type;
  sub_order_name;
  item_id;
  start_time;
  end_time;
  price;
  number;
  sub_order_date;
  sub_order_time;
  op_id;
  sale_id;
  turn_method;
  spend_amount;
  set_off_flag;
  reserve_str;
  clock_status;
  via_flag;
  shop_id;
}

interface IShopOrderDetail {
  order_id;
  deal_date?: Date;
  deal_time;
  op_id;
  staff_id;
  male_cus;
  major_item_desc;
  item_desc;
  commodity_desc;
  card_desc;
  price_sum;
  cash;
  unionpay;
  pet_card;
  coupon;
  groug;
  tally;
  other;
  free_flg;
  member_card_id;
  comments;
  room_id;
  female_cus;
  op_time;
  shop_id;
}

/**
 * 会员消费记录信息
 */
interface IMemberRecordReal {
  member_record_id;
  member_id;
  member_card_id;
  member_deal_type;
  amount;
  balance;
  integral;
  order_id;
  deal_date;
  deal_time;
  op_id;
  present;
  comm;
  shop_id;
}

interface IMemberInfoReal {
  member_id;
  member_card_id;
  passwd;
  member_card_sn;
  status;
  balance;
  member_name;
  male;
  integral;
  id_card;
  qq;
  email;
  birthday;
  mobiphones;
  salesman_id;
  op_date;
  op_time;
  op_id;
  end_time;
  shop_id;
}
