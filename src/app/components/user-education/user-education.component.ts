import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { isDate } from '../../custom-validators';
import { UserEducation } from 'src/app/models/UserEducation';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.css']
})
export class UserEducationComponent implements OnChanges, OnInit {

  @Input() education: UserEducation;
  @Input() educationIndex: number;
  @Input() action: string;
  @Output() modifiedEducation = new EventEmitter<User>();

  university_levels: Array<{value: string, label: string}>;
  ciclo_levels: Array<{value: string, label: string}>;
  selected_level: any;
  user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {

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
    this.userService.getUser(this.userService.getUserId()).subscribe((user: User) =>
    { this.user = user });
  }

  ngOnChanges(): void {

    if (this.action === 'delete') {
      this.deleteEducation();
      return;
    }

    if (this.education) {
      console.log(this.education.level)
      this.setName = this.education.name;
      this.setType = this.education.type;
      this.setUniversity = this.education.university;
      this.setFinish_date = this.education.finish_date;
      this.changeLevel();
    }
  }

  public educationGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]],
    type: ['', ],
    level: ['', ],
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
  }

  handleChange(): void {
    this.changeLevel();
  }

  deleteEducation(): void {
    if (confirm('Delete this record?')) {
      this.user.education.splice(this.educationIndex, 1);
      this.updateInMemoryUser(this.user);
    }
  }

  updateInMemoryUser(user: User): void {
    this.userService.updateUser(user);
    this.modifiedEducation.emit(user);
    this.education = undefined;
  }

  updateEducation(): void {

    if (this.educationGroup.valid) {

        const educationIndex = this.educationIndex ?? undefined;

        if (this.educationIndex || this.educationIndex === 0) {

          this.user.education[educationIndex].name = this.name.value;
          this.user.education[educationIndex].type = this.type.value;
          this.user.education[educationIndex].level = this.level.value;
          this.user.education[educationIndex].university = this.university.value;
          this.user.education[educationIndex].finish_date = this.finish_date.value;

        } else {

          this.user.education.push({
          name: this.name.value,
          type: this.type.value,
          level: this.level.value,
          university: this.university.value,
          finish_date: this.finish_date.value
        });

      }

      this.updateInMemoryUser(this.user);
      alert('Profile saved');
    }

  }

}
