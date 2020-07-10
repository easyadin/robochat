import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authServ: AuthService) { }

  ngOnInit() {
  }

  onSubmit(form) {
    this.authServ.login_With_Email_Password(form.email, form.password)
  }



}
