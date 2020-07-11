import { Subscription } from 'rxjs';
import { ChatService } from './../services/chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../model/chat';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.page.html',
  styleUrls: ['./contactlist.page.scss'],
})
export class ContactlistPage implements OnInit, OnDestroy {

  constructor(private chatService: ChatService) { }

  contactList: Contact[] = [];
  contactListSub: Subscription;

  ngOnInit() {
    this.contactListSub = this.chatService.contactListChanged.subscribe(list => {
      this.contactList = list;
    })
    this.chatService.getContactList();
  }


  ngOnDestroy(): void {
    this.contactListSub.unsubscribe()
  }
}
