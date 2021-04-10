import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../users/models/User';
import { isDate } from '../../validators/custom-validators';
import { Activity } from 'src/app/activities/models/Activity';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

import { UserService } from 'src/app/users/services/user.service';
import { ActivityService } from 'src/app/activities/services/activity.service';
import { addNewActivity, updateActivity } from '../actions';
import { updateUser } from 'src/app/users/actions';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent implements OnInit {

  @Input() activity: Activity;
  @Input() activityIndex: number;
  @Input() action: string;

  cultura_subcategory: Array<{ value: string, label: string }>;
  enoturismo_subcategory: Array<{ value: string, label: string }>;
  playa_subcategory: Array<{ value: string, label: string }>;
  selected_subcategory: any;
  userId: number;
  user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private activityService: ActivityService, private store: Store<AppState>) {

    this.cultura_subcategory = [
      { value: 'concierto', label: 'Concierto' },
      { value: 'espectaculo', label: 'Espectáculo' },
      { value: 'excursion', label: 'Excursión' },
      { value: 'festivales', label: 'Festivales' },
      { value: 'visita', label: 'Visita guiada' },
      { value: 'museo', label: 'Museo' },
      { value: 'monumento', label: 'Monumento' }
    ]

    this.enoturismo_subcategory = [
      { value: 'bodega', label: 'Bodega' },
      { value: 'cata', label: 'Cata de productos' },
      { value: 'museovino', label: 'Museo del vino' },
      { value: 'excursion', label: 'Excursión' },
      { value: 'visita', label: 'Visita guiada' }
    ]

    this.playa_subcategory = [
      { value: 'nautica', label: 'Actividad náutica' },
      { value: 'cala', label: 'Cala' },
      { value: 'excursion', label: 'Excursión' },
      { value: 'taller', label: 'Taller' }
    ]

    this.selected_subcategory = this.cultura_subcategory;
    this.userId = this.userService.getUserId();
  }

  ngOnInit(): void {

    if (this.userId) {
      this.store.select("usersReducers").subscribe(({ user }) => {
        setTimeout(() => {
          this.user = user
        }, 500);
      });

    }
    this.activityGroup.markAllAsTouched();
  }

  ngOnChanges(): void {

    if (this.activity) {
      this.setName = this.activity.name;
      this.setCategory = this.activity.category;
      this.setSubcategory = this.activity.subcategory;
      this.setDescription = this.activity.description;
      this.setLanguage = this.activity.language;
      this.setDate = this.activity.date;
      this.setPrice = this.activity.price;
      this.changeCategory();
    }
  }

  public activityGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    category: ['', Validators.required],
    subcategory: ['', Validators.required],
    description: ['',],
    language: ['', Validators.required],
    date: ['', isDate()],
    price: ['', [Validators.required, Validators.pattern(/^(\d+\.?\d*|\.\d+)$/)]]
  });

  get name() { return this.activityGroup.get('name'); }
  get category() { return this.activityGroup.get('category'); }
  get subcategory() { return this.activityGroup.get('subcategory'); }
  get description() { return this.activityGroup.get('description'); }
  get language() { return this.activityGroup.get('language'); }
  get date() { return this.activityGroup.get('date'); }
  get price() { return this.activityGroup.get('price'); }

  set setName(name: string) { this.activityGroup.get('name').setValue(name) }
  set setCategory(category: string) { this.activityGroup.get('category').setValue(category) }
  set setSubcategory(subcategory: string) { this.activityGroup.get('subcategory').setValue(subcategory) }
  set setDescription(description: string) { this.activityGroup.get('description').setValue(description) }
  set setLanguage(language: string) { this.activityGroup.get('language').setValue(language) }
  set setDate(date: string) { this.activityGroup.get('date').setValue(date) }
  set setPrice(price: number) { this.activityGroup.get('price').setValue(price) }

  changeCategory(): void {
    switch (this.category.value) {
      case 'cultura':
        this.selected_subcategory = this.cultura_subcategory;
        break;
      case 'enoturismo':
        this.selected_subcategory = this.enoturismo_subcategory;
        break;
      case 'playas':
        this.selected_subcategory = this.playa_subcategory;
    }
    this.setCategory = this.category.value;
    this.subcategory.markAsTouched();
  }

  handleChange(): void {
    this.changeCategory();
  }

  updateActivity(): void {

    if (this.activityGroup.valid) {

      this.activity = {
        ...this.activity,
        name: this.name.value,
        category: this.category.value,
        subcategory: this.subcategory.value,
        description: this.description.value,
        language: this.language.value,
        date: this.date.value,
        price: this.price.value,
        user: this.user.id
      }

    }

    if (this.action === 'edit') {
      this.store.dispatch(updateActivity({ activity: this.activity }))

    } else {
      this.activity.registered = [];
      this.store.dispatch(addNewActivity({ activity: this.activity }))
      this.activity = undefined;
    }

    alert('Activity saved');

  }


}
