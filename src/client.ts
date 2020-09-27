import { Okiniri } from './okiniri';


export class OkiniriClient extends Okiniri {

  constructor(
    appId: string,
    userId: string,
    userSecret: string,
  ) {
    super(appId, userId, userSecret);
  }

    async createObject(tag: string, objectId?: string, data?: string) {
      return super.createObject(tag, this.userId, objectId, data);
    }

}