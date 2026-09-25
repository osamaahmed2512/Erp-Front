import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';
import { WorkEntyForm } from '../../Components/work-enty-form/work-enty-form';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkentrytypeService } from '../../services/workentrytype.service';
import { DepartementService } from '../../../../Core/services/departement-service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { UpdateWorkEntryDto } from '../../Models/update-work-entry-dto';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-working-type-update',
  imports: [UpdatePageComponent, WorkEntyForm],
  templateUrl: './working-type-update.html',
  styleUrl: './working-type-update.css',
})
export class WorkingTypeUpdate implements OnInit, OnDestroy {
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    code: new FormControl('', { nonNullable: true, validators: Validators.required }),
    isPaid: new FormControl(false, { nonNullable: true, validators: Validators.required }),
    isWorkingTime: new FormControl(false, { nonNullable: true, validators: Validators.required }),
    companyId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    isActive: new FormControl(true, { nonNullable: true })
  })
  private id = '';
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  loadingCompanies = false;
  isSaving = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly service: WorkentrytypeService,
    private readonly companyService: DepartementService,
    private readonly accessService: AccessStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isSuperAdmin = this.accessService.isSystemUser();
    if (this.isSuperAdmin) {
      this.loadCompanies();
    }
    this.service.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const data = response.data;
        this.form.patchValue({
          name: data.name,
          code: data.code,
          companyId: data.companyId,
          isPaid: data.isPaid,
          isWorkingTime: data.isWorkingTime
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
    this.companyService.getDropDown().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DropDownDto[]) => { this.companies = data; this.loadingCompanies = false; },
      error: error => {
        this.loadingCompanies = false;
        this.toastr.error(error.error?.message || 'Unable to load companies.');
      }
    });
  }


  save(): void {
    if (this.form.invalid || (this.isSuperAdmin && !this.form.controls.companyId.value)) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const dto = this.form.getRawValue() as UpdateWorkEntryDto;
    this.service.Update(dto, this.id).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.router.navigate(['/work-entry-type']);
      },
      error: error => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to update position.');
      }
    });
  }

  cancel(): void { this.router.navigate(['/position']); }
}
