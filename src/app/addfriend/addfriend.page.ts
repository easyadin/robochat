import { Contact } from './../model/chat';
import { Subscription } from 'rxjs';
import { ChatService } from './../services/chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.page.html',
  styleUrls: ['./addfriend.page.scss'],
})
export class AddfriendPage implements OnInit, OnDestroy {
  constructor(private chatService: ChatService) { }

  // found friend
  contact: Contact;
  friendSubscription: Subscription;

  ngOnInit() {
    this.friendSubscription = this.chatService.newContactChanged.subscribe(found => {
      this.contact = found;
    })
  }

  onSubmit(form) {
    this.chatService.addContact(form.email)
  }


  ngOnDestroy(): void {
    this.friendSubscription.unsubscribe();
  }
}
