import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { passwordMatch, selectOneOption, hasWhitespaces, hasSpecialChars } from '../../validators/custom-validators';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  @Input() userExists: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.getSession()) {
      location.href = '/';
    }
    this.register.markAllAsTouched();
  }

  public register: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, hasWhitespaces(), hasSpecialChars()]],
    surname: ['', [Validators.required, hasWhitespaces(), hasSpecialChars()]],
    type: [0, Validators.required],
    email: ['', [Validators.required,
                  Validators.pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', Validators.required]
  }, {
    validator: [passwordMatch, selectOneOption]
  });

  get name() { return this.register.get('name'); }
  get surname() { return this.register.get('surname'); }
  get type() { return this.register.get('type'); }
  get email() { return this.register.get('email'); }
  get password() { return this.register.get('password'); }
  get password2() { return this.register.get('password2'); }

  registerUser(): void {

    this.register.markAllAsTouched();

    const newUser: User = new User();

    newUser.name = this.name.value;
    newUser.email = this.email.value;
    newUser.surname = this.surname.value;
    newUser.type = this.type.value;
    newUser.password = this.password.value;

    if (this.register.valid) {
      this.userExists = false;
      this.userService.register(newUser)
      .then(res => { if (res === 'ok') location.href = '/' })
      .catch(err => { if (err === 'user_exists') this.userExists = true })
    }

  }

}

