import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(private authSrv: AuthService) { }

  ngOnInit() {
  }

  // login with google
  login_With_Google() {
    this.authSrv.login_with_google();
  }
}
