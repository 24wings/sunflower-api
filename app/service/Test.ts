import { Service } from "egg";

/**
 * Test Service
 */
export default class Test extends Service {
  /**
   * sayHi to you
   * @param name - your name
   */
  public async index() {
    // return await this.ctx.model.User.findAll()
  }
}
