import { FilterPipe } from './../services/filter.pipe';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Contact } from '../model/chat';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(private chatService: ChatService) { }
  
  contactList: Contact[] = [];
  contactListSub: Subscription;

  searchText = '';

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
