/**
 * Created by root on 15/09/17.
 */

  import {User} from '../auth/user'

export class Conversation {


  _id:string;
  participants: User[];


  constructor() {
    this._id=null;

  }
}
