import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { ValidationMessage } from '../../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-salary-structure-form',
  imports: [ReactiveFormsModule, CommonModule, ValidationMessage],
  templateUrl: './salary-structure-form.html',
})
export class SalaryStructureForm {
  @Input({ required: true }) form!: FormGroup;
  @Input() isSuperAdmin = false;
  @Input() companies: DropDownDto[] = [];
  @Input() structureTypes: DropDownDto[] = [];
}
