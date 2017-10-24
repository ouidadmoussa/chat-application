/**
 * Created by root on 18/09/17.
 */
import { Component ,OnInit} from '@angular/core';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import { User } from './user';
import { AuthService }         from './auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../../assets/css/auth.css'],
  providers: [ AuthService ]
})
export class LoginComponent implements OnInit{



  constructor(private service: AuthService, private router : Router) {


  }

  public loginForm: FormGroup;


  ngOnInit() {

    this.loginForm = new FormGroup({

      email: new FormControl('', [<any>Validators.required, <any>Validators.minLength(4)]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(4)]),

    });

  }



  login(model: User, isValid: boolean) {

    this.service.login(model).subscribe(
        data => {
          console.log("data : " + data)
          if(data.success) this.router.navigate(['/home']);

                },
        error => {
        console.log("err : " +JSON.stringify(error));

      });


  }





}
