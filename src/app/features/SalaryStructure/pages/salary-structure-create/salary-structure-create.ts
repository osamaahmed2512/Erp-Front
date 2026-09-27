import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { SalaryStructureForm } from '../../components/salary-structure-form/salary-structure-form';
import { SalaryStructureService } from '../../Services/salary-structure.service';
import { StructureTypeService } from '../../../StructureType/Services/structure-type.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { CreateSalaryStructure } from '../../models/create-salary-structure';

@Component({
  selector: 'app-salary-structure-create',
  imports: [CreatePageComponent, SalaryStructureForm],
  templateUrl: './salary-structure-create.html',
})
export class SalaryStructureCreate implements OnInit, OnDestroy {
  structureForm!: FormGroup;
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  structureTypes: DropDownDto[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private salaryStructureService: SalaryStructureService,
    private structureTypeService: StructureTypeService,
    private accessStore: AccessStore,
    private compSer: DepartementService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.accessStore.isSystemUser();
    this.buildForm();

    if (this.isSuperAdmin) {
      this.loadCompanies();
      this.structureForm.get('companyId')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((companyId) => {
        this.structureForm.get('structureTypeId')!.reset('');
        this.loadStructureTypes(companyId);
      });
    } else {
      this.loadStructureTypes(this.accessStore.selectedCompanyId());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.structureForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
      code: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
      structureTypeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      isActive: new FormControl(true, { nonNullable: true }),
      companyId: new FormControl('', this.isSuperAdmin ? [Validators.required] : []),
    });
  }

  private loadCompanies(): void {
    this.compSer.getDropDown().pipe(takeUntil(this.destroy$)).subscribe({
      next: (companies: DropDownDto[]) => (this.companies = companies),
      error: () => this.toastr.error('Unable to load companies.'),
    });
  }

  private loadStructureTypes(companyId: string | null): void {
    this.structureTypes = [];
    if (!companyId) return;

    this.structureTypeService.getDropdown(companyId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (types) => (this.structureTypes = types),
      error: (err) => this.toastr.error(err.error?.message || 'Unable to load structure types.'),
    });
  }

  save(): void {
    if (this.structureForm.invalid) {
      this.structureForm.markAllAsTouched();
      return;
    }

    const companyId = this.isSuperAdmin
      ? (this.structureForm.get('companyId')!.value as string)
      : this.accessStore.selectedCompanyId();

    if (!companyId) {
      this.toastr.error('Select a company first.');
      return;
    }

    const dto: CreateSalaryStructure = {
      name: this.structureForm.get('name')!.value,
      code: this.structureForm.get('code')!.value,
      structureTypeId: this.structureForm.get('structureTypeId')!.value,
      isActive: this.structureForm.get('isActive')!.value,
      companyId,
    };

    this.isSaving = true;

    if (this.isSuperAdmin && this.accessStore.selectedCompanyId() !== companyId) {
      this.accessStore.initialize(companyId).subscribe({
        next: () => this.createStructure(dto),
        error: (err) => {
          this.isSaving = false;
          this.toastr.error(err.error?.message ?? 'Unable to select company.', 'Create Salary Structure Failed');
        },
      });
      return;
    }

    this.createStructure(dto);
  }

  private createStructure(dto: CreateSalaryStructure): void {
    this.salaryStructureService.create(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('Salary structure created.');
        this.router.navigate(['/salary-structure']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error(err.error?.message ?? 'Unable to create salary structure.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/salary-structure']);
  }
}
