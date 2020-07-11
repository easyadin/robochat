import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { ChattingList } from '../model/chat';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.page.html',
  styleUrls: ['./chatlist.page.scss'],
})
export class ChatlistPage implements OnInit, OnDestroy {
  constructor(private chatService: ChatService,
    private afs: AngularFirestore,) { }


  chatList: any = []
  chattingList: any = []
  chatListSub: Subscription;

  otherPerson: ChattingList
  // extract the other user 

  ngOnInit() {
    this.chatListSub = this.chatService.chatListChanged.subscribe(chat => {

      // can now access chat
      this.chatList = chat
      console.log(this.chatList)
      this.chatList.forEach(chat => {
        // get this user
        const thisUser = localStorage.getItem('rbcUserUID')
        console.log(thisUser)
        // const contact = chat.id.split(' ').indexOf(thisUser)
        const contact = chat.id.split(' ')
        console.log(contact)

        // other contact details | ignore last message for now
        // email: "test@gmail.com"
        // fullname: "asdas"
        // location: ""
        // password: "password"
        // phone: ""
        // status: "online"
        if (contact.indexOf(thisUser) == 0) {
          this.chatService.getPerson(contact[1]).subscribe(res => {
            this.otherPerson = new ChattingList(
              res.fullname,
              "",
              res.status,
              "",
              res.email
            )
            this.chattingList.push(this.otherPerson)
            console.log(res)
          })

        } else {
          this.chatService.getPerson(contact[0]).subscribe(res => {
            this.otherPerson = new ChattingList(
              res.fullname,
              "",
              res.status,
              ""
            )
            this.chattingList.push(this.otherPerson)
            console.log(res)
          })
        }
        console.log(this.chattingList)




      });
    })
    this.chatService.updateChatList();
  }


  ngOnDestroy(): void {
    this.chatListSub.unsubscribe()
  }
}
