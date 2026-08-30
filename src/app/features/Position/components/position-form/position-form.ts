import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';

@Component({
  selector: 'app-position-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './position-form.html',
  styleUrl: './position-form.css'
})
export class PositionForm {
  @Input({ required: true }) form!: FormGroup;
  @Input() isSuperAdmin = false;
  @Input() companies: DropDownDto[] = [];
  @Input() departments: DropDownDto[] = [];
  @Input() loadingCompanies = false;
  @Input() loadingDepartments = false;
}
