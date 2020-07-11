import { ChatService } from './../services/chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { pipe } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Chat } from '../model/chat';

@Component({
  selector: 'app-mainchat',
  templateUrl: './mainchat.page.html',
  styleUrls: ['./mainchat.page.scss'],
})
export class MainchatPage implements OnInit, OnDestroy {
  constructor(private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  chats: any;
  tempChat: any;
  private chatSub: Subscription;

  // chatID = [];
  chatID: string;
  ngOnInit() {
    // pair up id
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/maintabs/chatlist');
        return;
      }
      // this.chatID.push(paramMap.get('id'))
      // this.chatID.push(localStorage.getItem('rbcUserUID'))
      this.chatID = `${paramMap.get('id')} ${localStorage.getItem('rbcUserUID')}`
      this.chatService.filterChat(this.chatID);

      this.chatSub = this.chatService.sessionChatChanged.subscribe(data => {
        this.tempChat = data;
        this.chats = data;

        console.log(this.tempChat)
      })

    })

  }

  text = '';


  // TODO: 1. pair up two users email to create 
  //          chat id
  // 2. on send add fields as new message contaning sender email and content
  // 3. get only the message for the paired chat id  


  send() {
    this.chatService.send(this.text, this.chatID, localStorage.getItem('rbcUserUID'))
    this.text = ''
  }


  // get conversations
  // with paired id
  getConversation() {

  }


  ngOnDestroy(): void {
    this.chatSub.unsubscribe()
  }
}
