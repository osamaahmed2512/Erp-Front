import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';
import { SalaryRuleCategoryForm } from '../../components/salary-rule-category-form/salary-rule-category-form';
import { SalaryRuleCategoryService } from '../../Services/salary-rule-category.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { UpdateSalaryRuleCategory } from '../../models/update-salary-rule-category';

@Component({
  selector: 'app-salary-rule-category-update',
  imports: [UpdatePageComponent, SalaryRuleCategoryForm],
  templateUrl: './salary-rule-category-update.html',
})
export class SalaryRuleCategoryUpdate implements OnInit, OnDestroy {
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  categoryForm!: FormGroup;

  private id = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private categoryService: SalaryRuleCategoryService,
    private accessStore: AccessStore,
    private compSer: DepartementService,
    private router: Router,
    private toastr: ToastrService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isSuperAdmin = this.accessStore.isSystemUser();
    this.buildForm();
    this.loadCategory();
    if (this.isSuperAdmin) this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
      code: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
      isActive: new FormControl(true, { nonNullable: true }),
      companyId: new FormControl('', this.isSuperAdmin ? [Validators.required] : []),
    });
  }

  private loadCategory(): void {
    this.categoryService.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const data = response.data;
        this.categoryForm.patchValue(
          { name: data.name, code: data.code, companyId: data.companyId, isActive: data.isActive },
          { emitEvent: false }
        );
      },
      error: (error) => this.toastr.error(error.error?.message || 'Unable to load salary rule category.'),
    });
  }

  private loadCompanies(): void {
    this.compSer.getDropDown().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DropDownDto[]) => (this.companies = data),
      error: (error) => this.toastr.error(error.error?.message || 'Unable to load companies.'),
    });
  }

  save(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const raw = this.categoryForm.getRawValue();
    const companyId = (this.isSuperAdmin ? raw.companyId : this.accessStore.selectedCompanyId()) as string;
    if (!companyId) {
      this.toastr.error('Select a company first.');
      return;
    }

    const dto: UpdateSalaryRuleCategory = raw as UpdateSalaryRuleCategory;

    this.isSaving = true;
    this.categoryService.update(dto, this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.toastr.success(response.message);
        this.router.navigate(['/salary-rule-category']);
      },
      error: (error) => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to update salary rule category.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/salary-rule-category']);
  }
}
