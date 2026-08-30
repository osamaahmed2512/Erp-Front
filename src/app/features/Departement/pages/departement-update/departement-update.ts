import { Component } from '@angular/core';
import { UpdatePageComponent } from "../../../../shared/components/update-page.component/update-page.component";
import { ActivatedRoute, Router } from '@angular/router';
import { DepartementForm } from "../../Components/departement-form/departement-form";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../../../Core/services/token.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { DeptService } from '../../Services/dept.service';
import { UpdateDepartementDto } from '../../Models/update-departement-dto';
import { DepartementDto } from '../../Models/departement-dto';
import { BaseApiResponse } from '../../../../shared/Models/base-api-response';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';

@Component({
  selector: 'app-departement-update',
  imports: [UpdatePageComponent, DepartementForm, ReactiveFormsModule],
  templateUrl: './departement-update.html',
  styleUrl: './departement-update.css',
})
export class DepartementUpdate {
  departmentForm!: FormGroup;
  isSaving: boolean = false;
  isSuperAdmin: boolean = false;
  id!: string;
  companies: DropDownDto[] = [];
  constructor(private router: Router,
    private TokenService: TokenService,
    private deptService: DeptService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.buildForm();
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.isSuperAdmin = this.TokenService.isSuperAdmin();
    if(this.isSuperAdmin){
      this.loadCompanies();
    }
    this.loadDepartement();
  }

  buildForm() {
    this.departmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      companyId: new FormControl(
        '',
        this.isSuperAdmin ? Validators.required : []
      )
    });
  }
  loadCompanies() {
    this.deptService.getDropDown().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  loadDepartement() {
    this.deptService.getById(this.id).subscribe({
      next: (res: BaseApiResponse<DepartementDto>) => {
        this.departmentForm.patchValue(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  save() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const dto: UpdateDepartementDto = this.departmentForm.getRawValue() as UpdateDepartementDto;

    this.isSaving = true;
    this.deptService.update(dto, this.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/departement']);
      },
      error: (err) => {
        console.log(err);
        this.isSaving = false;
      }
    });
  }
  cancel() {
    this.router.navigate(['/departement']);
  }
}
