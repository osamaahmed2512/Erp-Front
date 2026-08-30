import { Component } from '@angular/core';
import { UpdatePageComponent } from "../../../../shared/components/update-page.component/update-page.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../Services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCompanyDto } from '../../Models/update.company.dto';
import { CompanyFormComponent } from "../../Components/company.form.component/company.form.component";
import { BaseApiResponse } from '../../../../shared/Models/base-api-response';
import { CompanyDto } from '../../Models/company.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company.update',
  imports: [UpdatePageComponent, CommonModule, ReactiveFormsModule, CompanyFormComponent],
  templateUrl: './company.update.html',
  styleUrl: './company.update.css',
})
export class CompanyUpdate {
  companyForm!: FormGroup;
  id!: string;
  Company!: BaseApiResponse<CompanyDto>
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {

  }
  ngOnInit() {
    this.buildForm();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadCompany();
  }

  isSaving = false;
  loadCompany() {
    this.companyService.GetById(this.id).subscribe({
      next: (res: BaseApiResponse<CompanyDto>) => {
        this.companyForm.patchValue(res.data);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Unable to load company details.');
      }
    })
  }
  buildForm() {
    this.companyForm = new FormGroup({

      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      description: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl(''),
      taxNumber: new FormControl(''),
      commercialRegistration: new FormControl(''),
      website: new FormControl('')
    });

  }

  save() {

    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    let dto: UpdateCompanyDto = this.companyForm.getRawValue() as UpdateCompanyDto;
    this.isSaving = true;

    this.companyService.Update(dto, this.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/company']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Unable to update company.');
        this.isSaving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/company']);
  }

  goBack() {
    window.history.back();
  }


}
