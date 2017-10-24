/**
 * Created by root on 09/10/17.
 */

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';



@Injectable()
export class SocketService  {

  private baseUrl:string = 'http://localhost:3000';

  private socket;

  connectSocket(){
    this.socket = io(this.baseUrl);
  }


  getAllConversations():any{
    this.socket.emit('getAllConversations');
  }

  getAllConversationsRes():any
  {

    let observable = new Observable(observer => {
      this.socket.on('getAllConversationRes', (data) => {
        console.log( "client data :"+ data )
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  createConversation(receverId:string,message:string):any{
    var data={'recepientId':receverId,'composedMsg' : message}
    this.socket.emit('new-conversation', data);

}

  newConversationRes():any{
    let observable = new Observable(observer => {
      this.socket.on('new-conversation-response', (data) => {
        console.log(data)
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  sendMessage(conversationId:string,message:string):any{
    var data={"message":message,"conversationId": conversationId}
    this.socket.emit('add-message', data);
  }

  receiveMessages():any{
    console.log("receive msg released")
    let observable = new Observable(observer => {
      this.socket.on('add-message-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  disconnect(){

  }


}
