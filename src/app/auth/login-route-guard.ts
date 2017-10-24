/**
 * Created by root on 01/04/17.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Subject } from 'rxjs/Subject';
import { Http, Response, Headers} from '@angular/http';


@Injectable()
export class LoginRouteGuard implements CanActivate {



    constructor(private router: Router,private http:Http) {}


     private baseUrl:string = 'http://localhost:3000';


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      return this.http
        .get(`${this.baseUrl}/getCurrentUser`, {headers: this.getHeaders()})
        .map((res:Response) => {
          if (res.status == 200) return true;
          else {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false
          }
        }).catch((err) => {
          console.log(err);
          this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
          return Observable.of(false);
        });
    }



  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return headers
  }
}
