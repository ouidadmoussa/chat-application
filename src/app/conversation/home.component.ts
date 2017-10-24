import { Component ,OnInit } from '@angular/core';

import {Conversation} from './conversation'
import {Message} from './message';
import {ChatService} from './chat.service'
import {SocketService} from './socket.service'


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['../../assets/css/style.css']
})


export class HomeComponent  implements OnInit{
  conversations : any[]= [];

  selectedConversation: Conversation;
  listMsg: Message[]=[];

  constructor(private chatService : ChatService, private socketService: SocketService) {}
  ngOnInit() {

    this.socketService.connectSocket();
    this.socketService.getAllConversations();

    this.socketService.getAllConversationsRes().subscribe(data => {
        console.log("dataaaaaaaaa :" + data)
          this.conversations = data.conversations
        if(this.conversations !=null) {
          this.selectedConversation = this.conversations[0].conversation
          this.chatService.getConMessages(this.conversations[0].conversation._id).subscribe(
              data => this.listMsg = data.convMessages,
              err => console.log(err)
          );
        }
        else this.selectedConversation = new Conversation()
        },
              err => console.log(err)
       )


 this.socketService.newConversationRes().subscribe(
   data=>{
     if(data.isOwner) {this.conversations.pop()}

     this.conversations.push(data.result)
     console.log("data.result   : " +data.result)
     this.selectedConversation= this.conversations[this.conversations.length-1].conversation  }
 )
  }
  onSelect(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.listMsg=[]
    if(conversation._id !=null) {
      this.chatService.getConMessages(conversation._id).subscribe(
          data => this.listMsg = data.convMessages,
          err => console.log(err)
      );
    }
  }
  newConversation(){

   var  data =new  Conversation();
    console.log('instantiated con : '+ data._id + "  :: " + data.participants )
    this.conversations.push({conversation:data,lastMsg:''})
    this.selectedConversation=data
    this.listMsg=[]
  }
}
