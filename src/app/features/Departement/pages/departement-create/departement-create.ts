import { Component } from '@angular/core';
import { CreatePageComponent } from "../../../../shared/components/create-page.component/create-page.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeptService } from '../../Services/dept.service';
import { Router } from '@angular/router';
import { CreateDepartmentDto } from '../../Models/create-department-dto';
import { DepartementForm } from "../../Components/departement-form/departement-form";
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';

@Component({
  selector: 'app-departement-create',
  imports: [CreatePageComponent, DepartementForm],
  templateUrl: './departement-create.html',
  styleUrl: './departement-create.css',
})
export class DepartementCreate {
  departmentForm!: FormGroup;
  isSaving = false;
  get isSystemUser(): boolean { return this.accessStore.isSystemUser(); }
  get companies(): DropDownDto[] { return this.accessStore.companies(); }

  constructor(
    private deptService: DeptService,
    private router: Router,
    private accessStore: AccessStore
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.departmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      companyId: new FormControl<string | null>(null, this.isSystemUser ? Validators.required : [])
    });
  }

  save() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const dto: CreateDepartmentDto = this.departmentForm.getRawValue() as CreateDepartmentDto;


    this.isSaving = true;
    const companyId = dto.companyId ?? '';
    if (this.isSystemUser && companyId && this.accessStore.selectedCompanyId() !== companyId) {
      this.accessStore.initialize(companyId).subscribe({
        next: () => this.createDepartment(dto),
        error: () => this.isSaving = false
      });
      return;
    }
    this.createDepartment(dto);
  }

  private createDepartment(dto: CreateDepartmentDto): void {
    this.deptService.create(dto).subscribe({
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

  goBack() {
    window.history.back();
  }
}
