import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  @Input() isPwdCorrrect: boolean = true;
  @Input() userExists: boolean = true;

  login = this.formBuilder.group({
    email: ['', [Validators.required,
        Validators.pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))]],
    password: ['', Validators.required]
  });

  get email() { return this.login.get('email'); }
  get password() { return this.login.get('password'); }

  ngOnInit(): void {
    if (this.userService.getSession()) {
      location.href = '/';
    }
  }

  loginUser(): void {

    this.login.markAllAsTouched();

    if (this.login.valid) {

      this.userService.login(this.email.value, this.password.value)
      .then(res => { if (res === 'ok') location.href = '/'; })
      .catch(err => {

        switch (err) {
          case 'invalid_pwd':
            this.isPwdCorrrect = false;
            this.userExists = true;
            break;
          case 'not_email_found':
            this.userExists = false;
            this.isPwdCorrrect = true;
        }

      })

    }

  }

}

