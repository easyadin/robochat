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

  sessionChat: any = [];
  sessionChatChanged = new Subject;

  // fetch chats
  fetchChats() {
    this.chatRef = this.afs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.chatRefChanged.next(this.chatRef)
  }

  // fetch chats for session
  filterChat(chatID: string) {

    console.log(chatID)
    // return this.afs.collection<any>('chats').doc(chatID).snapshotChanges().pipe(
    //   map(doc => {
    //     return { id: doc.payload, ...doc.payload.data }
    //   })
    // )
    this.sessionChat = this.afs.collection('chats').doc(chatID).valueChanges();
    this.sessionChatChanged.next(this.sessionChat)

    console.log(this.sessionChat)
  }

  filterChatTrigger() {
    // return this.afs.collection<any>('chats').doc(chatID).snapshotChanges().pipe(
    //   map(doc => {
    //     return { id: doc.payload, ...doc.payload.data }
    //   })
    // )
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


  send(message, chatID: any, sender) {
    let chatid = ""

    const data = {
      chatID, // participants
      message,
      sender,
      createdAt: Date.now()
    }

    return this.afs.collection('chats').doc(chatID).update({
      messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
    }).then(resp => {
      console.log(resp)
    }).catch(error => {
      // no document corresponds to provided id
      // split and check again
      const idsplit = chatID.split(' ');
      const fliped = `${idsplit[1]} ${idsplit[0]}`
      //
      return this.afs.collection('chats').doc(fliped).update({
        messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
      }).catch(resp => {
        // still no document?
        // create one
        return this.afs.collection('chats').doc(chatID).set({
          messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
        })
      })
    })


    // if exist? update
    // this.afs.doc<Chat>(`chats/${chatID}`).valueChanges().subscribe(chat => {

    //     chatid = chat.messages[0].chatID
    //     if (chatid.toString() == chatID.toString()) {
    //       // update
    //       return this.afs.collection('chats').doc(chatID).update({
    //         messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
    //       })
    //     }


    // message not found | id not found
    // split and reverse strings to check if exist
    // const idsplit = chatID.split(' ');
    // const fliped = `${idsplit[1]} ${idsplit[0]}`
    // console.log(idsplit)
    // console.log(fliped)
    // try the flipped id



    // console.log(chatid, chatID, chatid === chatID)
    // chatid already exist update 

    // return this.afs.collection('chats').doc(chatID).set({
    //   messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
    // })
    // });





    // add it console.log() // e.g tobiayokunnu@gmail.com test@gmail.com




    // const data = {
    //   chatID, // participants
    //   message,
    //   createdAt: Date.now()
    // }
    // return this.afs.collection('chats').doc(chatID).update({
    //   messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
    // }).then(resp => {
    //   console.log(resp)
    // }).catch(err => {

    //   // no document ? set it
    //   return this.afs.collection('chats').doc(chatID).set({
    //     messages: firebase.firestore.FieldValue.arrayUnion(data) // incremental merge
    //   })
    // })
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