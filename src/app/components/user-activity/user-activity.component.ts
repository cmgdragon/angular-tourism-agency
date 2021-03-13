import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { isDate } from '../../custom-validators';
import { UserService } from 'src/app/services/user.service';
import { Activity } from 'src/app/models/Activity';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent implements OnInit {

  @Input() activity: Activity;
  @Input() activityIndex: number;
  @Input() action: string;
  @Output() modifiedActivity = new EventEmitter<Activity>();

  cultura_subcategory: Array<{ value: string, label: string }>;
  enoturismo_subcategory: Array<{ value: string, label: string }>;
  playa_subcategory: Array<{ value: string, label: string }>;
  selected_subcategory: any;
  activityList: Array<Activity>;
  userId: number;
  user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private activityService: ActivityService) {

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
    this.userService.getUser(this.userId).subscribe((user: User) => { this.user = user });
    this.activityService.getUserActivities(this.userId).subscribe((activities: Array<Activity>) => { this.activityList = activities });
    this.activityGroup.markAllAsTouched();
  }

  ngOnChanges(): void {

    if (this.action === 'delete') {
      this.deleteActivity();
      return;
    }

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
    price: ['', [Validators.required, Validators.pattern(/^\d{0,2}(\.\d{1,2})?$/)]]
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

  deleteActivity(): void {
    if (confirm('Delete this activity?')) {

      const activityId = this.activity.id;
      this.activityService.deleteActivity(activityId);
      this.updateInMemoryActivity(this.activity);

      if (!this.activity?.registered || this.activity?.registered.length === 0) return;

      for (const userId of this.activity.registered) {
        console.log(this.activity)
        this.userService.getUser(userId).subscribe((user: User) => {
          user.activities.splice(user.activities.findIndex(a => a === activityId), 1);
          this.userService.updateUser(user);
        })
      }

    } else { this.activity = undefined; }
  }

  updateInMemoryActivity(activity: Activity): void {
    this.modifiedActivity.emit(activity);
    this.activity = undefined;
  }

  updateActivity(): void {

    if (this.activityGroup.valid) {

      this.activity.name = this.name.value;
      this.activity.category = this.category.value;
      this.activity.subcategory = this.subcategory.value;
      this.activity.description = this.description.value;
      this.activity.language = this.language.value;
      this.activity.date = this.date.value;
      this.activity.price = this.price.value;
      this.activity.user = this.user.id;
    }

    if (this.activityIndex) {
      this.activityService.updateActivity(this.activity);
    } else {
      this.activity.registered = [];
      this.activityService.addActivity(this.activity);
    }

    this.updateInMemoryActivity(this.activity);
    alert('Activity saved');

  }


}
