import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User, currentUser } from '../model/user';
import { Subject, Observable } from 'rxjs';
import { auth, database } from 'firebase/app';
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';

export interface imgData {
  name: string;
  filepath: string;
  size: number;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: AngularFireStorage,
    public googleplus: GooglePlus,
    public platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public auth: AngularFireAuth, private afs: AngularFirestore, private router: Router
  ) {

    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    this.imageCollection = afs.collection<imgData>('photos');
    this.images = this.imageCollection.valueChanges(); // add a subject

    // signup user
    this.userCollection = afs.collection<User>('users');

    this.auth.authState.subscribe(user => {
      this.user = user;
    })

    // check user login status
    localStorage.getItem('rbcUser') != null ? this._userIsAuthenticated = true : this._userIsAuthenticated = false;
    this.authenticationSubJect.next(this._userIsAuthenticated)
  }

  // realtime db
  databaseRef = database().ref('user/')

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
      return this.googleplus.login({}).then(
        resp => {
          const user_data_google = resp; // Data
          console.log(user_data_google)
          return this.auth.signInWithCredential(auth.GoogleAuthProvider.credential(null, user_data_google.accessToken))
            .then((response) => {
              this._userIsAuthenticated = true;
              // save to localstorage
              localStorage.setItem('rbcUser', JSON.stringify(response.user.providerData))
              // user login occured
              this.authenticationSubJect.next(this._userIsAuthenticated)
              // get user UID
              this.userUID = response.user.email;
              localStorage.setItem('rbcUserUID', this.userUID)
              // redirect user to chatlist
              this.router.navigateByUrl('/maintabs/chatlist')
            }).catch(err => {
              this.alertModal("Somthing went wrong, Probably my fault", err);
              console.log(err)
            })
        }
      ).catch(err => {
        this.alertModal("Somthing went wrong, Probably my fault", err);
        console.log(err)
      })
    }
    else {
      return this.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(resp => {
        this._userIsAuthenticated = true;
        // save to localstorage
        localStorage.setItem('rbcUser', JSON.stringify(resp.user.providerData))
        // user login occured
        this.authenticationSubJect.next(this._userIsAuthenticated)
        // get user UID
        this.userUID = resp.user.email;
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
  async login_With_Email_Password(email, password) {
    const spinner = await this.loadingController.create({
      animated: true,
      message: "One sec..."
    })
    await spinner.present()
    this.auth.signInWithEmailAndPassword(email, password).then(
      resp => {
        spinner.dismiss()
        this._userIsAuthenticated = true;
        // save to localStorage
        localStorage.setItem('rbcUser', JSON.stringify(resp.user.providerData))
        // user login occured
        this.authenticationSubJect.next(this._userIsAuthenticated)
        // get user UID
        this.userUID = resp.user.email;
        localStorage.setItem('rbcUserUID', this.userUID)

        // redirect user to chatlist
        this.router.navigateByUrl('/maintabs/chatlist')
      }
    ).catch(err => {
      this.alertModal("We cannot find your login credentials", err);
      spinner.dismiss()
    })
  }


  // logout and delete details from local storage
  async logout() {
    const spinner = await this.loadingController.create({
      animated: true,
      message: "One sec..."
    })
    await spinner.present()
    this.auth.signOut().then(
      resp => {
        spinner.dismiss()
        // delete from localStorage
        localStorage.removeItem('rbcUser')
        localStorage.removeItem('rbcUserUID')
        localStorage.removeItem('contacts')
        this._userIsAuthenticated = false;
        this.authenticationSubJect.next(this._userIsAuthenticated)
        this.currentUserSubject.next(this.currentUser)
        this.router.navigateByUrl('/splashscreen')


        // change user status offline
      }

    );

  }

  // register with email and password
  async register_With_Email_Password(user: User) {
    const spinner = await this.loadingController.create({
      animated: true,
      message: "One sec..."
    })
    await spinner.present()
    // convert typescript object to firebase object
    const newUser = JSON.parse(JSON.stringify(user))

    this.auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(
      resp => {
        // store new user email
        localStorage.setItem('rbcUserUID', newUser.email)
        // add user details to database | email as UID
        this.userCollection.doc(newUser.email).set(newUser).then(res => {
          spinner.dismiss()
          this._userIsAuthenticated = true;
          this.authenticationSubJect.next(this._userIsAuthenticated)
          // redirect user to chatlist
          this.router.navigateByUrl('/maintabs/chatlist')
          // save to localStorage
          localStorage.setItem('rbcUser', JSON.stringify(resp.user.providerData))
        }).catch(err => {
          this.alertModal("Somthing went wrong, Probably my fault", err);
          console.log(err)
        })
      }
    ).catch(err => {
      spinner.dismiss()
      this.alertModal("Somthing went wrong, Probably my fault", err);
      console.log(err)
    })
  }


  // update user data | settings

  async updateUserData(user: User) {
    const spinner = await this.loadingController.create({
      animated: true,
      message: "One sec..."
    })
    await spinner.present()
    // convert typescript object to firebase object
    const updateUser = JSON.parse(JSON.stringify(user))
    this.afs.doc<User>(`users/${this.userUID}`).set(updateUser, { merge: true }).then(res => {
      spinner.dismiss()
    }).catch(err => {
      spinner.dismiss()
      this.alertModal("Somthing went wrong, Probably my fault", err);
      console.log(err)
    })
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
          user.password,
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


  // Uploaded Image | Profile Photo
  isUploading = true;
  isUploaded = false;

  //File details  
  fileName: string;
  fileSize: number;

  private imageCollection: AngularFirestoreCollection<imgData>;

  // Upload Task 
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;


  images: Observable<imgData[]>;
  // upload photo
  uploadPhoto(event, email) {
    // file object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;



    this.fileName = file.name;
    // The storage path
    const path = `photos/${new Date().getTime()}_${file.name}`;

    //File reference
    const fileRef = this.storage.ref(path);

    // Totally optional metadata
    const customMetadata = { app: 'RoboChat user phots' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          }, email);
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  addImagetoDB(image: imgData, email) {
    //Create an ID for document
    // image id will be user email to retrieve faster

    //Set document id with value in database
    this.imageCollection.doc(email).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }


}
