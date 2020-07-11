import { currentUser } from './../model/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  constructor(private authSrv: AuthService) { }

  currentUser: currentUser;
  userSub: Subscription;

  ngOnInit() {
  }

  // User details
  fname = ''
  email = ''
  password = ''
  confirmpassword = ''
  phone = ''
  location = ''

  ionViewWillEnter() {
    this.userSub = this.authSrv.currentUserSubject.subscribe(user => {
      this.currentUser = user;

      this.fname = this.currentUser.fullname;
      this.email = this.currentUser.email;
      this.password = this.currentUser.password;
      this.phone = this.currentUser.phone;
      this.location = this.currentUser.location;
      // image to display
    })

    this.authSrv.fetchCurrentUser();
  }

  onSubmit() {

  }


  logout() {
    this.authSrv.logout();
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
