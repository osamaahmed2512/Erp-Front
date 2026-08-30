import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { CommonModule } from '@angular/common';
import { ValidationMessage } from '../../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-employee-from',
  imports: [ReactiveFormsModule,CommonModule,ValidationMessage],
  standalone:true,
  templateUrl: './employee-from.html',
  styleUrl: './employee-from.css',
})
export class EmployeeFrom {
  @Input() form!: FormGroup;
  @Input() isSuperAdmin: boolean = false;
  @Input() companies: DropDownDto[] = [];
  @Input() nationalities:DropDownDto[]=[];
}
