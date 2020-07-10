import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User, currentUser } from '../model/user';
import { Subject } from 'rxjs';
import { auth } from 'firebase/app';
import { GooglePlus } from "@ionic-native/google-plus/ngx";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public googleplus: GooglePlus,
    public platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public auth: AngularFireAuth, private afs: AngularFirestore, private router: Router
  ) {
    // signup user
    this.userCollection = afs.collection<User>('users');

    this.auth.authState.subscribe(user => {
      this.user = user;
    })

    // check user login status
    localStorage.getItem('rbcUser') != null ? this._userIsAuthenticated = true : this._userIsAuthenticated = false;
    this.authenticationSubJect.next(this._userIsAuthenticated)
  }

  private user: firebase.User;

  private userCollection: AngularFirestoreCollection<User>;
  _userIsAuthenticated = false;
  currentUser: currentUser; // local user details

  userUID; // id to identify user
  authenticationSubJect = new Subject();
  currentUserSubject = new Subject<currentUser>();


  // login with google
  login_with_google() {
    // check platform
    if (this.platform.is('mobile')) {
      this.googleplus.login({}).then(
        resp =>{
          console.log(resp)
        }
      )
    }
    else {
      return this.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(resp => {
        console.log(resp.user.providerData)
        this._userIsAuthenticated = true;
        // save to localstorage
        localStorage.setItem('rbcUser', JSON.stringify(resp.user.providerData))
        // user login occured
        this.authenticationSubJect.next(this._userIsAuthenticated)
        // get user UID
        this.userUID = resp.user.uid;
        localStorage.setItem('rbcUserUID', this.userUID)
        // redirect user to chatlist
        this.router.navigateByUrl('/maintabs/chatlist')
      }).catch(err => {
        this.alertModal("Somthing went wrong, Probably my fault", err);
        console.log(err)
      })
    }
  }

  // login with email
  login_With_Email_Password(email, password) {
    this.auth.signInWithEmailAndPassword(email, password).then(
      resp => {
        this._userIsAuthenticated = true;
        // save to localStorage
        localStorage.setItem('rbcUser', JSON.stringify(resp.user.providerData))
        // user login occured
        this.authenticationSubJect.next(this._userIsAuthenticated)
        // get user UID
        this.userUID = resp.user.uid;
        localStorage.setItem('rbcUserUID', this.userUID)

        // redirect user to chatlist
        this.router.navigateByUrl('/maintabs/chatlist')
      }
    ).catch(err => {
      this.alertModal("We cannot find your login credentials", err);
    })
  }


  // logout and delete details from local storage
  logout() {
    this.auth.signOut().then(
      resp => {
        // delete from localStorage
        localStorage.removeItem('rbcUser')
        localStorage.removeItem('rbcUserUID')
        this._userIsAuthenticated = false;
        this.authenticationSubJect.next(this._userIsAuthenticated)
        this.currentUserSubject.next(this.currentUser)
        this.router.navigateByUrl('/splashscreen')
      }

    );

  }

  // register with email and password
  register_With_Email_Password(user: User) {
    // convert typescript object to firebase object
    const newUser = JSON.parse(JSON.stringify(user))

    this.auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(
      resp => {
        // get user UID
        this.userUID = resp.user.uid;
        localStorage.setItem('rbcUserUID', this.userUID)
        // add user details to database
        this.userCollection.doc(resp.user.uid).set(newUser).then(res => {
          this._userIsAuthenticated = true;
          this.authenticationSubJect.next(this._userIsAuthenticated)
          // redirect user to chatlist
          this.router.navigateByUrl('/maintabs/chatlist')
          // save to localStorage
          localStorage.setItem('rbcUser', JSON.stringify(resp.user.providerData))
        })
      }
    )
  }


  // update user data | settings

  updateUserData(user: User) {
    // convert typescript object to firebase object
    const updateUser = JSON.parse(JSON.stringify(user))
    this.afs.doc<User>(`users/${this.userUID}`).set(updateUser, { merge: true })
  }



  // get user authentication status
  getUserIsAuthenticated() {
    this.authenticationSubJect.next(this._userIsAuthenticated)
  }

  // fetch user details by UID from database
  fetchCurrentUser() {
    this.userUID = localStorage.getItem('rbcUserUID')
    // UID cannot be null
    if (this.userUID != null) {
      this.afs.doc<User>(`users/${this.userUID}`).valueChanges().subscribe(user => {
        // build the user
        this.currentUser = new currentUser(
          user.fullname,
          user.phone,
          user.email,
          user.location,
          user.status
        )
        this.currentUserSubject.next(this.currentUser);
      })
    }
  }

  // reset password | send user an email 
  resetPassword(email) {
    this.auth.sendPasswordResetEmail(email);
  }


  // get current user details | Observable
  getCurrentUser() {
    this.currentUserSubject.next(this.currentUser);
  }

  // alert modal
  async alertModal(subHeader, message) {
    // user not found 
    const alert = this.alertController.create({
      cssClass: 'modal-css',
      subHeader: subHeader,
      message: message,
      buttons: ['Retry']
    });
    (await alert).present()
  }
}
