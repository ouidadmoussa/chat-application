import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginRouteGuard } from './auth/login-route-guard';
import {HomeComponent} from './conversation/home.component'
import  {SignupComponent} from './auth/signup.component'
import {LoginComponent} from './auth/login.component'
import {ConversationDetailComponent} from './conversation/conversation.component'
 //_________________________services__________________________________

import {AuthService} from './auth/auth.service';
import {ChatService} from './conversation/chat.service';
import {SocketService} from './conversation/socket.service'


const appRoutes:Routes = [

  {path: '', component: HomeComponent,canActivate: [LoginRouteGuard]},
  {path: 'home', component: HomeComponent, canActivate: [LoginRouteGuard]},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent}


];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ConversationDetailComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService,ChatService,SocketService,LoginRouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
