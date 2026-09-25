import { Component, Input } from '@angular/core';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValidationMessage } from '../../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-work-enty-form',
  imports: [CommonModule,ReactiveFormsModule,ValidationMessage],
  standalone:true,
  templateUrl: './work-enty-form.html',
  styleUrl: './work-enty-form.css',
})
export class WorkEntyForm {
  @Input({required:true}) form!:FormGroup;
  @Input() isSuperAdmin = false;
  @Input() companies: DropDownDto[] = [];
  @Input() loadingCompanies = false;
}
