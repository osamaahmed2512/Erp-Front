import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { CommonModule } from '@angular/common';
import { ValidationMessage } from '../../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-structure-type-form',
  imports: [ReactiveFormsModule,CommonModule,ValidationMessage],
  templateUrl: './structure-types.form.html',
  styleUrl: './structure-types.form.css',
})
export class StructureTypesForm {
  @Input({required:true}) form!:FormGroup;
  @Input() isSuperAdmin = false;
  @Input() companies: DropDownDto[] = [];
}
