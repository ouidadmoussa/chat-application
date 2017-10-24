/**
 * Created by root on 18/09/17.
 */

export class  User {

    _id:string;
    fullName  : string;
    password :string;
    email:string;
   socketId:string;

  constructor() {
    this._id=null;
    this.fullName ="";
    this.password="";
    this.email="";
    this.socketId="";

  }
}
