/**
 * 省份
 */
interface IRegion {
  name: string;
  /**
   * 城市
   */
  city: ICity[];
}

interface ICity {
  name: string;
  area: string[];
}
