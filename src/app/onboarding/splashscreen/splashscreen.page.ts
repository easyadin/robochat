import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(private authSrv: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  // login with google
  // not working yet 
  login_with_google() {
    this.authSrv.login_with_google()
  }
}
