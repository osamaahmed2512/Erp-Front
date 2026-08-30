import { Component, Input } from '@angular/core';
import {  FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-form',
  imports: [ReactiveFormsModule],
  templateUrl: './company.form.component.html',
  styleUrl: './company.form.component.css',
  standalone:true
})
export class CompanyFormComponent {
   @Input() form!:FormGroup
}
