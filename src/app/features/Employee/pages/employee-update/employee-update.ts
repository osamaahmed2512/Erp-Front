import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { EmployeeService } from '../../services/employee-service';
import { TokenService } from '../../../../Core/services/token.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { NationalityService } from '../../../../Core/services/nationality-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeUpdateDto } from '../../model/employee-update-dto';
import { BaseApiResponse } from '../../../../shared/Models/base-api-response';
import { EmployeeDto } from '../../model/employee-dto';
import { EmployeeFrom } from '../../Components/employee-from/employee-from';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';

@Component({
  selector: 'app-employee-update',
  imports: [EmployeeFrom,UpdatePageComponent],
  templateUrl: './employee-update.html',
  styleUrl: './employee-update.css',
})
export class EmployeeUpdate {
  employeeForm!: FormGroup;
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  nationalities: DropDownDto[] = [];
  id!: string;

  constructor(
    private empService: EmployeeService,
    private tokenService: TokenService,
    private companyService: DepartementService,
    private nationalityService: NationalityService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.isSuperAdmin = this.tokenService.isSuperAdmin();
    if (this.isSuperAdmin) {
      this.loadCompanies();
    }
    this.loadNationalities();
    this.buildEmployees();
  }

  loadNationalities() {
    this.nationalityService.getDropDown().subscribe({
      next: (res: DropDownDto[]) => {
        debugger;
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
      password: new FormControl(null),
      nationalityNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{14}$/)]),
      nationalityId: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      martielStatus: new FormControl<number | null>(null, Validators.required),
      birthDate: new FormControl('', Validators.required),
      gender: new FormControl<number | null>(null, Validators.required),
      companyId: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)

    });
  }
  buildEmployees() {
    this.empService.getById(this.id).subscribe({
      next:(res:BaseApiResponse<EmployeeDto>)=>{
        this.employeeForm.patchValue(res.data);
      },
      error:(err)=>{
          this.toastr.error(
          err.error.message,
          "Error Load Data"
        );
      }
    })
  }
  cancel(): void {
    this.router.navigate(['/employee']);
  }
  save() {
    debugger;
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const dto: EmployeeUpdateDto = this.employeeForm.getRawValue() as EmployeeUpdateDto;

    this.isSaving = true;
    this.empService.Update(dto, this.id).subscribe({

      next: () => {
        debugger;
        this.isSaving = false;
        this.router.navigate(['/employee']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error(
          err.error.message,
          "update Employee Failed"
        );
      }
    });
  }
}
