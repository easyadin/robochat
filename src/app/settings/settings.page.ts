import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private authSrv: AuthService) { }

  ngOnInit() {
  }


  onSubmit() {

  }


  logout() {
    this.authSrv.logout();
  }
}
