/**
 * Created by root on 15/09/17.
 */

import { Component,Input,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Conversation } from './conversation';
import { User } from '../auth/user';
import {Message} from './message';
import {AuthService} from '../auth/auth.service';
import {ChatService} from './chat.service';
import {SocketService} from './socket.service'

@Component({
  selector: 'conversation-detail',
  templateUrl: './conversation.component.html',
  styleUrls: ['../../assets/css/chat.css', '../../assets/css/style.css'],

})
export class ConversationDetailComponent implements OnInit {

  @Input() conversation:Conversation;
  message:string;
  recever = new User();
  listUsers:User[];
  filtered:any[];
  currentUser= new User();
 @Input()  listMsg: Message[];



  constructor(private socketService:SocketService, private chatService:ChatService) {
  }


  ngOnInit() {



    this.chatService.getAllUsers().subscribe(
        data => this.listUsers = data.listUsers,
        err =>  console.log(err)
    )


    this.chatService.getCurrentUser().subscribe(
        data =>
        {
          this.currentUser=data

          console.log("currentUser : " +this.currentUser._id)
        },
        err =>console.log(err)
    )

    this.socketService.receiveMessages().subscribe(response => {
     console.log("client : " + response)
      for (var i in response) console.log(i + "  :  "+ response[i])
      if(this.conversation._id && this.conversation._id == response.conversationId) {
        this.listMsg.push(response);
        setTimeout( () =>{
          document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
        },100);
      }
    });
  }


  valueToggle(selectedUser) {
    for (let i in selectedUser) console.log(i + ":::" + selectedUser[i])
    this.recever = selectedUser;
    this.filtered = [];

  }

  valuechange(event) {

    this.filtered = [];

    if (event.keyCode == 8 || event.keyCode == 46) {
      this.recever = new User();
    }

    else {

      if (this.recever.fullName != '') {

        this.filtered = this.listUsers.filter((user) => {
          if (user.fullName.toLowerCase().search(this.recever.fullName.toLowerCase()) > -1) return user

        })


      }


    }

  }

  sendMessage() {
    if (this.recever._id != null && this.message != ''&& this.conversation._id == null)
        this.socketService.createConversation(this.recever._id, this.message)


      if(this.message != '' && this.conversation._id != null)
        this.socketService.sendMessage(this.conversation._id, this.message)

        var data=new Message()
        data.author=this.currentUser;
        data.body=this.message;
        this.message = null;

        this.listMsg.push(data);
        setTimeout( () =>{
          document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
        },100);




  }


}
