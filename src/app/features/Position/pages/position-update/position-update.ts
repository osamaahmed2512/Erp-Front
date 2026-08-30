import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TokenService } from '../../../../Core/services/token.service';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { PositionForm } from '../../components/position-form/position-form';
import { UpdatePositionDto } from '../../models/position.models';
import { PositionService } from '../../services/position.service';

@Component({
  selector: 'app-position-update',
  standalone: true,
  imports: [UpdatePageComponent, PositionForm],
  template: `
    <app-update-page entityName="Position" [isSaving]="isSaving" (saveEvent)="save()" (cancelEvent)="cancel()">
      <app-position-form [form]="form" [isSuperAdmin]="isSuperAdmin" [companies]="companies" [departments]="departments" [loadingCompanies]="loadingCompanies" [loadingDepartments]="loadingDepartments" />
    </app-update-page>
  `
})
export class PositionUpdate implements OnInit, OnDestroy {
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string | null>(null),
    companyId: new FormControl('', { nonNullable: true }),
    departmentId: new FormControl('', { nonNullable: true, validators: Validators.required })
  });
  private id = '';
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  departments: DropDownDto[] = [];
  loadingCompanies = false;
  loadingDepartments = false;
  isSaving = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly service: PositionService,
    private readonly tokenService: TokenService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isSuperAdmin = this.tokenService.isSuperAdmin();
    if (this.isSuperAdmin) {
      this.form.controls.companyId.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(companyId => {
        this.form.controls.departmentId.reset('');
        this.departments = [];
        if (companyId) this.loadDepartments(companyId);
      });
      this.loadCompanies();
    } else {
      this.loadDepartments();
    }
    this.service.getById(this.id).subscribe({
      next: response => {
        const position = response.data;
        const companyId = position.companyId ?? '';
        const departmentId = position.departmentId ?? '';
        this.form.patchValue({
          title: position.title,
          description: position.description,
          companyId
        }, { emitEvent: false });
        if (this.isSuperAdmin) {
          this.loadDepartments(companyId, departmentId);
        } else {
          this.form.controls.departmentId.setValue(departmentId);
        }
      },
      error: error => this.toastr.error(error.error?.message || 'Unable to load position.')
    });
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

  private loadDepartments(companyId?: string, selectedDepartmentId?: string): void {
    this.loadingDepartments = true;
    this.service.getDepartments(companyId).subscribe({
      next: data => {
        this.departments = data;
        this.loadingDepartments = false;
        if (selectedDepartmentId) this.form.controls.departmentId.setValue(selectedDepartmentId);
      },
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
    this.service.update(this.id, { title, description, departmentId } as UpdatePositionDto).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.router.navigate(['/position']);
      },
      error: error => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to update position.');
      }
    });
  }

  cancel(): void { this.router.navigate(['/position']); }
}
