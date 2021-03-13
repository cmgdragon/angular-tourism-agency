import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatch(control: AbstractControl): void {
  if (control.get('password').value !== control.get('password2').value) {
    return control.get('password2').setErrors({ passwordMatch: true });
  }
}

export function selectOneOption(control: AbstractControl): void {
  if (control.get('type').value === 0) {
    return control.get('type').setErrors({ selectOneOption: true });
  }
}

export function hasWhitespaces(twoSided: boolean = true): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (twoSided)
      return /^([\s]).*|([\s])$/ig.test(control.value) ? { hasWhitespaces: { value: true } } : null;
    else
      return /^([\s])/.test(control.value) ? { hasWhitespaces: { value: true } } : null;
  };
}

export function hasSpecialChars(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return !/^[\w.-]+$/ig.test(control.value) ? { hasSpecialChars: { value: true } } : null;
  };
}

export function isDate(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value === '') return null;
    if (!/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/.test(control.value)) return { isDate: { value: true } };
    const numbers = control.value.split('/');
    if (parseInt(numbers[0]) > 31 || parseInt(numbers[0]) <= 0) return { invalidDay: { value: true } };
    if (parseInt(numbers[1]) > 12 || parseInt(numbers[0]) <= 0) return { invalidMonth: { value: true } };
    return null;
  };
}

export function isNIF(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return !(/^(\d{8})([A-HJ-NP-TV-Z])$/.test(control.value) && control.value[8] ===
      "TRWAGMYFPDXBNJZSQVHLCKE"[parseInt(control.value.substring(0, 8)) % 23])
      ? { isNIF: { value: true } } : null;
  };
}
