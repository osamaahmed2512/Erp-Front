import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

function dayValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.get('isWorkingDay')?.value) return null;
  const start = control.get('startTime')?.value;
  const end = control.get('endTime')?.value;
  const breakMinutes = Number(control.get('breakMinutes')?.value ?? 0);
  if (!start || !end || end <= start || breakMinutes < 0) return { invalidShift: true };
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return breakMinutes >= (eh * 60 + em) - (sh * 60 + sm) ? { invalidShift: true } : null;
}

function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const from = control.get('effectiveFrom')?.value;
  const to = control.get('effectiveTo')?.value;
  return from && to && to < from ? { invalidDateRange: true } : null;
}

export function createWorkingScheduleForm(): FormGroup {
  const days = Array.from({ length: 7 }, (_, dayOfWeek) => new FormGroup({
    dayOfWeek: new FormControl(dayOfWeek, { nonNullable: true }),
    isWorkingDay: new FormControl(dayOfWeek > 0 && dayOfWeek < 6, { nonNullable: true }),
    startTime: new FormControl(dayOfWeek > 0 && dayOfWeek < 6 ? '09:00' : null),
    endTime: new FormControl(dayOfWeek > 0 && dayOfWeek < 6 ? '17:00' : null),
    breakMinutes: new FormControl(dayOfWeek > 0 && dayOfWeek < 6 ? 60 : 0, { nonNullable: true, validators: Validators.min(0) })
  }, { validators: dayValidator }));

  return new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
    companyId: new FormControl<string | null>(null),
    isActive: new FormControl(true, { nonNullable: true }),
    effectiveFrom: new FormControl(new Date().toISOString().slice(0, 10), { nonNullable: true, validators: Validators.required }),
    effectiveTo: new FormControl<string | null>(null),
    days: new FormArray(days)
  }, { validators: dateRangeValidator });
}
