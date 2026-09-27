import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';
import { SalaryStructureForm } from '../../components/salary-structure-form/salary-structure-form';
import { SalaryStructureService } from '../../Services/salary-structure.service';
import { StructureTypeService } from '../../../StructureType/Services/structure-type.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { UpdateSalaryStructure } from '../../models/update-salary-structure';

@Component({
  selector: 'app-salary-structure-update',
  imports: [UpdatePageComponent, SalaryStructureForm],
  templateUrl: './salary-structure-update.html',
})
export class SalaryStructureUpdate implements OnInit, OnDestroy {
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  structureTypes: DropDownDto[] = [];
  structureForm!: FormGroup;

  private id = '';
  private loaded = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private salaryStructureService: SalaryStructureService,
    private structureTypeService: StructureTypeService,
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
    this.loadStructure();

    if (this.isSuperAdmin) {
      this.loadCompanies();
      this.structureForm.get('companyId')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((companyId) => {
        if (!this.loaded) return;
        this.structureForm.get('structureTypeId')!.reset('');
        this.loadStructureTypes(companyId);
      });
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

  private loadStructure(): void {
    this.salaryStructureService.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const data = response.data;
        this.structureForm.patchValue(
          {
            name: data.name,
            code: data.code,
            structureTypeId: data.structureTypeId,
            companyId: data.companyId,
            isActive: data.isActive,
          },
          { emitEvent: false }
        );
        this.loaded = true;
        this.loadStructureTypes(data.companyId);
      },
      error: (error) => this.toastr.error(error.error?.message || 'Unable to load salary structure.'),
    });
  }

  private loadCompanies(): void {
    this.compSer.getDropDown().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DropDownDto[]) => (this.companies = data),
      error: (error) => this.toastr.error(error.error?.message || 'Unable to load companies.'),
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

    const raw = this.structureForm.getRawValue();
    const companyId = (this.isSuperAdmin ? raw.companyId : this.accessStore.selectedCompanyId()) as string;
    if (!companyId) {
      this.toastr.error('Select a company first.');
      return;
    }

    const dto: UpdateSalaryStructure = {
      name: raw.name,
      code: raw.code,
      structureTypeId: raw.structureTypeId,
      isActive: raw.isActive,
      companyId,
    };

    this.isSaving = true;
    this.salaryStructureService.update(dto, this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.toastr.success(response.message);
        this.router.navigate(['/salary-structure']);
      },
      error: (error) => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to update salary structure.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/salary-structure']);
  }
}
