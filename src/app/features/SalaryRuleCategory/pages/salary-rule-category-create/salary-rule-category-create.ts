import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { SalaryRuleCategoryForm } from '../../components/salary-rule-category-form/salary-rule-category-form';
import { SalaryRuleCategoryService } from '../../Services/salary-rule-category.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { CreateSalaryRuleCategory } from '../../models/create-salary-rule-category';

@Component({
  selector: 'app-salary-rule-category-create',
  imports: [CreatePageComponent, SalaryRuleCategoryForm],
  templateUrl: './salary-rule-category-create.html',
})
export class SalaryRuleCategoryCreate implements OnInit {
  categoryForm!: FormGroup;
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];

  constructor(
    private categoryService: SalaryRuleCategoryService,
    private accessStore: AccessStore,
    private compSer: DepartementService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.accessStore.isSystemUser();
    this.buildForm();
    if (this.isSuperAdmin) this.loadCompanies();
  }

  private buildForm(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
      code: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
      isActive: new FormControl(true, { nonNullable: true }),
      companyId: new FormControl('', this.isSuperAdmin ? [Validators.required] : []),
    });
  }

  private loadCompanies(): void {
    this.compSer.getDropDown().subscribe({
      next: (companies: DropDownDto[]) => (this.companies = companies),
      error: () => this.toastr.error('Unable to load companies.'),
    });
  }

  save(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const companyId = this.isSuperAdmin
      ? (this.categoryForm.get('companyId')!.value as string)
      : this.accessStore.selectedCompanyId();

    if (!companyId) {
      this.toastr.error('Select a company first.');
      return;
    }

    const dto: CreateSalaryRuleCategory = {
      name: this.categoryForm.get('name')!.value,
      code: this.categoryForm.get('code')!.value,
      isActive: this.categoryForm.get('isActive')!.value,
      companyId,
    };

    this.isSaving = true;

    if (this.isSuperAdmin && this.accessStore.selectedCompanyId() !== companyId) {
      this.accessStore.initialize(companyId).subscribe({
        next: () => this.createCategory(dto),
        error: (err) => {
          this.isSaving = false;
          this.toastr.error(err.error?.message ?? 'Unable to select company.', 'Create Salary Rule Category Failed');
        },
      });
      return;
    }

    this.createCategory(dto);
  }

  private createCategory(dto: CreateSalaryRuleCategory): void {
    this.categoryService.create(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('Salary rule category created.');
        this.router.navigate(['/salary-rule-category']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error(err.error?.message ?? 'Unable to create salary rule category.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/salary-rule-category']);
  }
}
