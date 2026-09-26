import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { ValidationMessage } from '../../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-salary-rule-category-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationMessage],
  templateUrl: './salary-rule-category-form.html',
})
export class SalaryRuleCategoryForm {
  @Input({ required: true }) form!: FormGroup;
  @Input() isSuperAdmin = false;
  @Input() companies: DropDownDto[] = [];
}
