import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/User';
import { isDate } from '../../validators/custom-validators';
import { UserEducation } from 'src/app/users/models/UserEducation';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

import { UserService } from 'src/app/users/services/user.service';
import { updateUser } from '../actions';

@Component({
  selector: 'app-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.css']
})
export class UserEducationComponent implements OnChanges, OnInit {

  @Input() education: UserEducation;
  @Input() educationIndex: number;
  @Input() action: string;

  university_levels: Array<{ value: string, label: string }>;
  ciclo_levels: Array<{ value: string, label: string }>;
  selected_level: any;
  user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private store: Store<AppState>) {

    this.university_levels = [
      { value: 'grado', label: 'Grado' },
      { value: 'diplomado', label: 'Diplomado' },
      { value: 'licenciado', label: 'Licenciado' },
      { value: 'ingeniero', label: 'Ingeniero' },
      { value: 'master', label: 'Máster' },
      { value: 'doctorado', label: 'Doctorado' }
    ]

    this.ciclo_levels = [
      { value: 'medio', label: 'Grado medio' },
      { value: 'superior', label: 'Grado superior' }
    ]

    this.selected_level = this.university_levels;
  }

  ngOnInit(): void {
    this.store.select("usersReducers").subscribe(({user}) => this.user = {...user});
    this.educationGroup.markAllAsTouched();
    console.log(this.user)
  }

  ngOnChanges(): void {

    if (this.action === 'delete') {
      this.deleteEducation();
      return;
    }

    if (this.education) {
      this.setName = this.education.name;
      this.setType = this.education.type;
      this.setUniversity = this.education.university;
      this.setFinish_date = this.education.finish_date;
      this.changeLevel();
    }
  }

  public educationGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]],
    type: ['', Validators.required],
    level: ['', Validators.required],
    university: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]],
    finish_date: ['', isDate()]
  });

  get name() { return this.educationGroup.get('name'); }
  get type() { return this.educationGroup.get('type'); }
  get level() { return this.educationGroup.get('level'); }
  get university() { return this.educationGroup.get('university'); }
  get finish_date() { return this.educationGroup.get('finish_date'); }

  set setName(name: string) { this.educationGroup.get('name').setValue(name) }
  set setType(type: string) { this.educationGroup.get('type').setValue(type) }
  set setLevel(level: string) { this.educationGroup.get('level').setValue(level) }
  set setUniversity(university: string) { this.educationGroup.get('university').setValue(university) }
  set setFinish_date(finish_date: string) { this.educationGroup.get('finish_date').setValue(finish_date) }

  changeLevel(): void {
    switch (this.type.value) {
      case 'titulo':
        this.selected_level = this.university_levels;
        break;
      default:
        this.selected_level = this.ciclo_levels;
    }
    this.setLevel = this.education.level;
    this.level.markAsTouched();
  }

  handleChange(): void {
    this.changeLevel();
  }

  deleteEducation(): void {
    if (confirm('Delete this record?')) {
      this.user ={...this.user, education: [...this.user.education.filter((education, educationIndex) =>
      educationIndex !== this.educationIndex
    )]}
    this.store.dispatch(updateUser({user: this.user}));
    }

    this.education = undefined;
  }

  updateEducation(): void {

    if (this.educationGroup.valid) {

      if (this.educationIndex || this.educationIndex === 0) {

        this.user.education = this.user.education.map((education, educationIndex) =>
          educationIndex !== this.educationIndex ? education :
          {
            name: this.name.value,
            type: this.type.value,
            level: this.level.value,
            university: this.university.value,
            finish_date: this.finish_date.value
          }
        )

      } else {

        this.user.education = [...this.user.education, {
          name: this.name.value,
          type: this.type.value,
          level: this.level.value,
          university: this.university.value,
          finish_date: this.finish_date.value
        }];

      }

      this.store.dispatch(updateUser({user: this.user}));
      this.education = undefined;
      alert('Profile saved');
    }

  }

}
