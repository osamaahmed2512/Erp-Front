import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { PositionForm } from '../../components/position-form/position-form';
import { CreatePositionDto } from '../../models/position.models';
import { PositionService } from '../../services/position.service';

@Component({
  selector: 'app-position-create',
  standalone: true,
  imports: [CreatePageComponent, PositionForm],
  template: `
    <app-create-page entityName="Position" [isSaving]="isSaving" (saveEvent)="save()" (cancelEvent)="cancel()">
      <app-position-form [form]="form" [isSuperAdmin]="isSuperAdmin" [companies]="companies" [departments]="departments" [loadingCompanies]="loadingCompanies" [loadingDepartments]="loadingDepartments" />
    </app-create-page>
  `
})
export class PositionCreate implements OnInit, OnDestroy {
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string | null>(null),
    companyId: new FormControl('', { nonNullable: true }),
    departmentId: new FormControl('', { nonNullable: true, validators: Validators.required })
  });
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  departments: DropDownDto[] = [];
  loadingCompanies = false;
  loadingDepartments = false;
  isSaving = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly service: PositionService,
    private readonly accessStore: AccessStore,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.accessStore.isSystemUser();
    if (this.isSuperAdmin) {
      this.form.controls.companyId.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(companyId => {
        this.form.controls.departmentId.reset('');
        this.departments = [];
        if (companyId) {
          this.accessStore.initialize(companyId).subscribe({
            next: () => this.loadDepartments(companyId),
            error: error => this.toastr.error(error.error?.message || 'Unable to select company.')
          });
        }
      });
      this.loadCompanies();
      return;
    }
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCompanies(): void {
    this.loadingCompanies = true;
    this.service.getCompanies().subscribe({
      next: data => { this.companies = data; this.loadingCompanies = false; },
      error: error => {
        this.loadingCompanies = false;
        this.toastr.error(error.error?.message || 'Unable to load companies.');
      }
    });
  }

  private loadDepartments(companyId?: string): void {
    this.loadingDepartments = true;
    this.service.getDepartments(companyId).subscribe({
      next: data => { this.departments = data; this.loadingDepartments = false; },
      error: error => {
        this.loadingDepartments = false;
        this.toastr.error(error.error?.message || 'Unable to load departments.');
      }
    });
  }

  save(): void {
    if (this.form.invalid || (this.isSuperAdmin && !this.form.controls.companyId.value)) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const { title, description, departmentId } = this.form.getRawValue();
    this.service.create({ title, description, departmentId } as CreatePositionDto).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.router.navigate(['/position']);
      },
      error: error => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to create position.');
      }
    });
  }

  cancel(): void { this.router.navigate(['/position']); }
}
