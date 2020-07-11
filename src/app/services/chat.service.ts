import { Router } from '@angular/router';
import { Contact, Chat } from './../model/chat';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as  firebase from 'firebase';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    public alertController: AlertController,
    private authService: AuthService, private afs: AngularFirestore,
    private router: Router
  ) {
    // test chat
    this.chatRef = this.afs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.chatRefChanged.next(this.chatRef)

    // contact list
    this.contactList = JSON.parse(localStorage.getItem('contacts')) == null ? [] : JSON.parse(localStorage.getItem('contacts'));
    this.contactListChanged.next(this.contactList);
  }

  contactList: Contact[] = [];
  newContact: Contact;

  contactListChanged = new Subject<Contact[]>();
  newContactChanged = new Subject<Contact>();

  // fetch chats
  fetchChats() {
    this.chatRef = this.afs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.chatRefChanged.next(this.chatRef)
  }

  // fetch chats
  filterChat(chatID) {
    this.afs.collection("chats").snapshotChanges().pipe(
      map(a => a.map(mp => {
        const data = mp.payload.doc.data();
        return data.participantID.includes(chatID[0]) && data.participantID.includes(chatID[1])
      }))
    ).subscribe(
      data => {
        console.log(data)
      }
    )




  }


  // add contact
  addContact(email) {
    try {
      // check contact exist
      if (email != null || email != undefined) {
        this.afs.doc<any>(`users/${email}`).valueChanges().subscribe(user => {
         
          if (user != undefined) {
            // build the contact
            this.newContact = new Contact(user.email, user.fullname)

            // the contact to contactList
            this.contactList.push(this.newContact);
            this.newContactChanged.next(this.newContact);
            this.contactListChanged.next(this.contactList);
            // save contacts to storage
            localStorage.setItem('contacts', JSON.stringify(this.contactList))
          }
          else {
            this.alertModal("User not found");
          }
        })
      }
    } catch (error) {
      this.alertModal("User not found");
    }
  }

  // get contactList 
  getContactList() {
    return this.contactListChanged.next([...this.contactList])
  }

  // get new found friend result
  getFoundfriend() {

    return this.newContactChanged.next(this.newContact)
  }


  // test chat
  chatRef: any;
  chatRefChanged = new Subject<Chat[]>();

  // initiate session | connection 
  // bind the user to friend
  sendtest(message) {
    if (message != '') {
      this.afs.collection('chats').add({
        Message: message,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        this.chatRefChanged.next(this.chatRef)
      })
    }
  }

  chatTemp: Chat[] = []
  newChat: Chat;


  send(message, chatID: any) {
    if (message != '') {
      this.afs.collection('chats').add({
        Message: message,
        participantID: chatID,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        this.chatRefChanged.next(this.chatRef)
      })
    }
  }


  // alert modal
  async alertModal(message) {
    // user not found 
    const alert = this.alertController.create({
      cssClass: 'modal-css',
      message: message,
      buttons: ['Retry']
    });
    (await alert).present()
  }


}
