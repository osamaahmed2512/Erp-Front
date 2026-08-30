import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { ValidationMessage } from '../../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-working-schedule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessage],
  templateUrl: './working-schedule-form.html',
  styleUrl: './working-schedule-form.css'
})
export class WorkingScheduleForm {
  @Input({ required: true }) form!: FormGroup;
  @Input() companies: DropDownDto[] = [];
  @Input() loadingCompanies = false;
  @Input() lockCompany = false;
  @Input() showCompany = true;
  readonly dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  get days(): FormArray { return this.form.get('days') as FormArray; }
}
