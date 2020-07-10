import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  user: User;

  onSubmit(form) {
    this.user = new User(
      form.name,
      "", //phone
      form.email,
      form.password,
      "", //location
      "online"
    )
    this.authService.register_With_Email_Password(this.user);
  }
}
