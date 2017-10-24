/**
 * Created by root on 18/09/17.
 */
import { Component ,OnInit} from '@angular/core';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import { User } from './user';
import { AuthService }         from './auth.service';


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../assets/css/auth.css'],
  providers: [ AuthService ]
})
export class SignupComponent implements OnInit {


  constructor(private service:AuthService, private router:Router) {
  }

  public signupForm:FormGroup;


  ngOnInit() {

    this.signupForm = new FormGroup({
      fullName: new FormControl('', [<any>Validators.required, <any>Validators.minLength(4)]),
      email: new FormControl('', [<any>Validators.required, <any>Validators.minLength(4)]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(4)]),

    });
  }

  signup(model:User, isValid:boolean) {


    this.service.signup(model).subscribe(
        data => {

            console.log("data : " + data)
          if(data.success){
              console.log("cc")
              this.router.navigate(['/home']);
            }


        },
            error => {
        console.log("err : " + JSON.stringify(error));
      });


  }
}
