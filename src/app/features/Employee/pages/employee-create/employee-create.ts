import { Component } from '@angular/core';
import { CreatePageComponent } from "../../../../shared/components/create-page.component/create-page.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { EmployeeService } from '../../services/employee-service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../../Company/Services/company.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { NationalityService } from '../../../../Core/services/nationality-service';
import { EmployeeFrom } from '../../Components/employee-from/employee-from';
import { EmployeeCreateDto } from '../../model/employee-create-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-create',
  imports: [CreatePageComponent, EmployeeFrom],
  standalone: true,
  templateUrl: './employee-create.html',
  styleUrl: './employee-create.css',
})
export class EmployeeCreate {
  employeeForm!: FormGroup;
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  nationalities: DropDownDto[] = [];

  constructor(
    private empService: EmployeeService,
    private accessStore: AccessStore,
    private companyService: DepartementService,
    private nationalityService: NationalityService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isSuperAdmin = this.accessStore.isSystemUser();
    this.loadNationalities();
    if (this.isSuperAdmin) {
      this.loadCompanies();
    }
    this.buildForm();

  }

  loadNationalities() {
    this.nationalityService.getDropDown().subscribe({
      next: (res: DropDownDto[]) => {
        this.nationalities = res
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadCompanies() {
    this.companyService.getDropDown().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  buildForm() {
    this.employeeForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      nationalityNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{14}$/)]),
      nationalityId: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      martielStatus: new FormControl<number | null>(null, Validators.required),
      birthDate: new FormControl('', Validators.required),
      gender: new FormControl<number | null>(null, Validators.required),
      companyId: new FormControl('', this.isSuperAdmin ? Validators.required : []),
      status: new FormControl({ value: 0, disabled: true })
    });
  }
  cancel(): void {
    this.router.navigate(['/employee']);
  }
  save() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const dto: EmployeeCreateDto = this.employeeForm.getRawValue() as EmployeeCreateDto;
    const companyId = this.employeeForm.get('companyId')?.value;

    this.isSaving = true;
    if (this.isSuperAdmin && companyId && this.accessStore.selectedCompanyId() !== companyId) {
      this.accessStore.initialize(companyId).subscribe({
        next: () => this.createEmployee(dto, companyId),
        error: err => {
          this.isSaving = false;
          this.toastr.error(err.error?.message || 'Unable to select company.', 'Create Employee Failed');
        }
      });
      return;
    }
    this.createEmployee(dto, companyId);
  }

  private createEmployee(dto: EmployeeCreateDto, companyId: string): void {
    this.empService.create(dto, companyId).subscribe({

      next: () => {
        this.isSaving = false;
        this.router.navigate(['/employee']);
      },
      error: (err) => {
        this.isSaving =false;
        this.toastr.error(
          err.error.message,
          "Create Employee Failed"
        );
      }
    });
  }
}
