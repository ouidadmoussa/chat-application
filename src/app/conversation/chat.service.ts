/**
 * Created by root on 02/10/17.
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { User }                from '../auth/user';
import {Conversation} from './conversation'

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ChatService {

  private baseUrl:string = 'http://localhost:3000';


  constructor(private http:Http) {}

   getCurrentUser():Observable<any> {
     let res$ =this.http
    .get(`${this.baseUrl}/getCurrentUser`, {headers: this.getHeaders()})
    .map((res:Response) => res.json())
  return res$
}

  createConversation( userId :string , Msg :string):Observable<any> {

    let res$ = this.http
      .post(`${this.baseUrl}/api/inbox/newConversation`, JSON.stringify({'recepientId':userId,'composedMsg' : Msg}), {headers: this.getHeaders()})
      .map((response:Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));




    return res$


  }
  sendReply(convId :string, msg:string):Observable<any>{

    let res$ = this.http
      .post(`${this.baseUrl}/api/inbox/sendReply`, JSON.stringify({'conversationId':convId,'composedMsg' : msg}), {headers: this.getHeaders()})
      .map((response:Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));




    return res$
  }



  getAllUsers():  Observable<any> {
    let result$ = this.http
      .get(`${this.baseUrl}/api/user/listUsers`, {headers: this.getHeaders()})
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || error));
    console.log("service :::: "+result$);
    return    result$

  }


   getAllConversations() :Observable<any> {

  let result$ = this.http
  .get(`${this.baseUrl}/api/inbox/getConversations`, {headers:this.getHeaders()})
  .map((res:Response) => res.json())
  .catch((error:any) => Observable.throw(error.json().error || error));

  return    result$

}

  getConMessages(id :string) :Observable<any> {

    let result$ = this.http
      .get(`${this.baseUrl}/api/inbox/getConversation/`+id, {headers:this.getHeaders()})
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || error));

    return    result$


  }



  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return headers
  }


}
