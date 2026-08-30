import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departement-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './departement-form.html',
  styleUrl: './departement-form.css',
})
export class DepartementForm {
  @Input() form!: FormGroup;
  @Input() isSuperAdmin: boolean = false;
  @Input() companies: DropDownDto[] = [];
}
