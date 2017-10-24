/**
 * Created by root on 23/02/17.
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { User }                from './user';

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthService {

    private baseUrl:string = 'http://localhost:3000';


    constructor(private http:Http) {}



  signup(data:User):Observable<any> {
    console.log("en fin " + JSON.stringify(data));
    let res$ = this.http
      .post(`${this.baseUrl}/api/user/signup`, JSON.stringify(data), {headers: this.getHeaders()})
      .map((response:Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    console.log("check result on service : " + typeof res$);
    return res$
  }


    login(data:User) {
      console.log("en fin " + JSON.stringify(data) );
        let res$ = this.http
            .post(`${this.baseUrl}/api/user/login`, JSON.stringify(data), {headers: this.getHeaders()})
            .map((response:Response) => {
                     console.log("vvvv "+ response.json())
                return response.json();

            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));


        return res$

    }






private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

  return headers
}




}
