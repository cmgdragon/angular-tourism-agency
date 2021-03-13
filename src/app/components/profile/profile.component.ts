import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { isNIF, isDate, hasWhitespaces, hasSpecialChars } from '../../custom-validators';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userType: string = undefined;
  userId: number = undefined;
  user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.userType = this.userService.getUserType();
    this.userId = this.userService.getUserId();
  }

  ngOnInit(): void {
    this.userService.getUser(this.userService.getUserId()).subscribe((user: User) => {
      this.user = user;
      this.setName = user.name;
      this.setSurname = user.surname;
      this.setBirthdate = user.profile?.birthdate;
      this.setPhone = user.profile?.phone;
      this.setNationality = user.profile?.nationality;
      this.setNif = user.profile?.nif;
      this.setAbout = user.profile?.about;
      if (this.userType === 'company') {
        this.setCompany_name = user.profile?.company_name;
        this.setCompany_description = user.profile?.company_description;
        this.setCif = user.profile?.cif;
      }
    });
    this.profile.markAllAsTouched();
  }

  public profile: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, hasWhitespaces(), hasSpecialChars(), Validators.minLength(3), Validators.maxLength(55)]],
    surname: ['', [hasWhitespaces(), hasSpecialChars(), Validators.minLength(3), Validators.maxLength(55)]],
    birthdate: ['', isDate()],
    phone: ['',],
    nationality: ['', [Validators.required]],
    nif: ['', [Validators.required, isNIF()]],
    about: ['',],
    company_name: ['', [this.userService.getUserType() === 'company' ? Validators.required : Validators.nullValidator,
    this.userService.getUserType() === 'company' ? Validators.minLength(3) : Validators.nullValidator,
    this.userService.getUserType() === 'company' ? Validators.maxLength(255) : Validators.nullValidator,
    this.userService.getUserType() === 'company' ? hasWhitespaces(false) : Validators.nullValidator]
    ],
    company_description: ['',],
    cif: ['', this.userService.getUserType() === 'company' ? Validators.required : Validators.nullValidator]
  });

  get name() { return this.profile.get('name'); }
  get surname() { return this.profile.get('surname'); }
  get birthdate() { return this.profile.get('birthdate'); }
  get phone() { return this.profile.get('phone'); }
  get nationality() { return this.profile.get('nationality'); }
  get nif() { return this.profile.get('nif'); }
  get about() { return this.profile.get('about'); }
  get company_name() { return this.profile.get('company_name'); }
  get company_description() { return this.profile.get('company_description'); }
  get cif() { return this.profile.get('cif'); }

  set setName(name: string) { this.profile.get('name').setValue(name) }
  set setSurname(surname: string) { this.profile.get('surname').setValue(surname) }
  set setBirthdate(birthdate: string) { this.profile.get('birthdate').setValue(birthdate) }
  set setPhone(phone: number) { this.profile.get('phone').setValue(phone) }
  set setNationality(nationality: string) { this.profile.get('nationality').setValue(nationality) }
  set setNif(nif: string) { this.profile.get('nif').setValue(nif) }
  set setAbout(about: string) { this.profile.get('about').setValue(about) }
  set setCompany_name(company_name: string) { this.profile.get('company_name').setValue(company_name) }
  set setCompany_description(company_description: string) { this.profile.get('company_description').setValue(company_description) }
  set setCif(cif: string) { this.profile.get('cif').setValue(cif) }


  updateProfile(): void {

    this.user.name = this.name.value;
    this.user.surname = this.surname.value;
    this.user.profile = {
      birthdate: this.birthdate.value,
      phone: this.phone.value,
      nationality: this.nationality.value,
      nif: this.nif.value,
      about: this.about.value
    }

    if (this.userType === 'company') {
      this.user.profile.company_name = this.company_name.value;
      this.user.profile.company_description = this.company_description.value;
      this.user.profile.cif = this.cif.value;
    }

    if (this.profile.valid) {
      this.userService.updateUser(this.user);
      alert('Profile saved');
    }

  }

}
