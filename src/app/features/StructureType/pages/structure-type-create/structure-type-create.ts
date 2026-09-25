import { Component } from '@angular/core';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { StructureTypesForm } from '../../components/structure-types.form/structure-types.form';
import { StructureTypeService } from '../../Services/structure-type.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartementService } from '../../../../Core/services/departement-service';
import { CreateSturctureType } from '../../models/create-sturcture-type';

@Component({
  selector: 'app-structure-type-create',
  imports: [CreatePageComponent, StructureTypesForm],
  templateUrl: './structure-type-create.html',
  styleUrl: './structure-type-create.css',
})
export class StructureTypeCreate {
  structureTypeForm!: FormGroup;
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];

  constructor(
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
    }
  }

  private buildForm(): void {
    this.structureTypeForm = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      code: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      isActive: new FormControl(true, { nonNullable: true }),
      companyId: new FormControl(
        '',
        this.isSuperAdmin ? [Validators.required] : []
      ),
    });
  }

  private loadCompanies(): void {
    this.compSer.getDropDown().subscribe({
      next: (companies: DropDownDto[]) => {
        this.companies = companies;
      },
      error: () => {
        this.toastr.error('Unable to load companies.');
      },
    });
  }

  save(): void {
    if (this.structureTypeForm.invalid) {
      this.structureTypeForm.markAllAsTouched();
      return;
    }

    const companyId = this.isSuperAdmin
      ? this.structureTypeForm.get('companyId')!.value as string
      : this.accessStore.selectedCompanyId();

    if (!companyId) {
      this.toastr.error('Select a company first.');
      return;
    }

    const dto: CreateSturctureType = {
      name: this.structureTypeForm.get('name')!.value,
      code: this.structureTypeForm.get('code')!.value,
      isActive: this.structureTypeForm.get('isActive')!.value,
      companyId,
    };

    this.isSaving = true;

    if (this.isSuperAdmin && this.accessStore.selectedCompanyId() !== companyId) {
      this.accessStore.initialize(companyId).subscribe({
        next: () => this.createStructureType(dto, companyId),
        error: (err) => {
          this.isSaving = false;
          this.toastr.error(
            err.error?.message ?? 'Unable to select company.',
            'Create Structure Type Failed'
          );
        },
      });
      return;
    }

    this.createStructureType(dto, companyId);
  }

  private createStructureType(dto: CreateSturctureType, companyId: string): void {
    this.structureTypeService.create(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('Structure type created.');
        this.router.navigate(['/structure-type']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error(
          err.error?.message ?? 'Unable to create structure type.'
        );
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/structure-type']);
  }
}
