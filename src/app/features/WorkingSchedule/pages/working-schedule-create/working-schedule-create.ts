import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { WorkingScheduleForm } from '../../components/working-schedule-form/working-schedule-form';
import { createWorkingScheduleForm } from '../../components/working-schedule-form/working-schedule-form.factory';
import { CreateWorkingScheduleDto } from '../../models/working-schedule.models';
import { WorkingScheduleService } from '../../services/working-schedule.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';

@Component({
  selector: 'app-working-schedule-create',
  standalone: true,
  imports: [CreatePageComponent, WorkingScheduleForm],
  templateUrl: './working-schedule-create.html',
  styleUrl: './working-schedule-create.css'
})
export class WorkingScheduleCreate {
  readonly form = createWorkingScheduleForm();
  isSaving = false;
  get isSystemUser(): boolean { return this.accessStore.isSystemUser(); }
  get companies(): DropDownDto[] { return this.accessStore.companies(); }
  constructor(
    private readonly service: WorkingScheduleService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly accessStore: AccessStore
  ) {}

  ngOnInit(): void {
    if (this.isSystemUser) {
      this.form.controls['companyId'].setValidators(Validators.required);
      this.form.controls['companyId'].updateValueAndValidity();
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const dto = this.form.getRawValue() as CreateWorkingScheduleDto;

    const companyId = dto.companyId ?? '';
    if (this.isSystemUser && companyId && this.accessStore.selectedCompanyId() !== companyId) {
      this.accessStore.initialize(companyId).subscribe({
        next: () => this.createSchedule(dto),
        error: error => {
          this.isSaving = false;
          this.toastr.error(error.error?.message || 'Unable to select company.');
        }
      });
      return;
    }
    this.createSchedule(dto);
  }

  private createSchedule(dto: CreateWorkingScheduleDto): void {
    this.service.create(dto).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.router.navigate(['/working-schedule']);
      },
      error: error => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to create working schedule.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/working-schedule']);
  }
}
