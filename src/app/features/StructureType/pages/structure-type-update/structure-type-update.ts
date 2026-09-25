import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';
import { StructureTypesForm } from '../../components/structure-types.form/structure-types.form';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { StructureTypeService } from '../../Services/structure-type.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UpdateSturctureType } from '../../models/update-sturcture-type';

@Component({
  selector: 'app-structure-type-update',
  imports: [UpdatePageComponent, StructureTypesForm],
  templateUrl: './structure-type-update.html',
  styleUrl: './structure-type-update.css',
})
export class StructureTypeUpdate implements OnInit, OnDestroy {
  isSaving = false;
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  loadingCompanies = false;
  structureTypeForm!: FormGroup;

  private id = '';
  private readonly destroy$ = new Subject<void>();
  constructor(
    private structureTypeService: StructureTypeService,
    private accessService: AccessStore,
    private compSer: DepartementService,
    private router: Router,
    private toastr: ToastrService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isSuperAdmin = this.accessService.isSystemUser();
    this.LoadForm();
    if (this.isSuperAdmin) {
      this.loadCompanies();
    }

  }
  LoadForm(): void {
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
    this.structureTypeService.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const data = response.data;
        this.structureTypeForm.patchValue({
          name: data.name,
          code: data.code,
          companyId: data.companyId,
          isActive: data.isActive
        }, { emitEvent: false });
      },
      error: error => this.toastr.error(error.error?.message || 'Unable to load work entry.')
    });

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCompanies(): void {
    this.loadingCompanies = true;
    this.compSer.getDropDown().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DropDownDto[]) => { this.companies = data; this.loadingCompanies = false; },
      error: error => {
        this.loadingCompanies = false;
        this.toastr.error(error.error?.message || 'Unable to load companies.');
      }
    });
  }


  save(): void {
    if (
      this.structureTypeForm.invalid ||
      (this.isSuperAdmin && !this.structureTypeForm.controls['companyId'].value)
    ) {
      this.structureTypeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const dto = this.structureTypeForm.getRawValue() as UpdateSturctureType;

    this.structureTypeService.Update(dto, this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.isSaving = false;
          this.toastr.success(response.message);
          this.router.navigate(['/structure-type']);
        },
        error: error => {
          this.isSaving = false;
          this.toastr.error(
            error.error?.message || 'Unable to update structure type.'
          );
        }
      });
  }

  cancel(): void { this.router.navigate(['/structure-type']); }
}
