import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UpdatePageComponent } from '../../../../shared/components/update-page.component/update-page.component';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { WorkingScheduleForm } from '../../components/working-schedule-form/working-schedule-form';
import { createWorkingScheduleForm } from '../../components/working-schedule-form/working-schedule-form.factory';
import { UpdateWorkingScheduleDto } from '../../models/working-schedule.models';
import { WorkingScheduleService } from '../../services/working-schedule.service';

@Component({
  selector: 'app-working-schedule-update',
  standalone: true,
  imports: [UpdatePageComponent, WorkingScheduleForm],
  templateUrl: './working-schedule-update.html',
  styleUrl: './working-schedule-update.css'
})
export class WorkingScheduleUpdate implements OnInit {
  readonly form = createWorkingScheduleForm();
  private id = '';
  companies: DropDownDto[] = [];
  isSaving = false;
  constructor(
    private readonly service: WorkingScheduleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadWorkingSchedule();
  }

  private loadWorkingSchedule(): void {
    this.service.getById(this.id).subscribe({
      next: response => {
        const schedule = response.data;
        this.companies = [{ id: schedule.companyId, name: schedule.companyName }];
        this.form.patchValue({
          name: schedule.name,
          companyId: schedule.companyId,
          isActive: schedule.isActive,
          effectiveFrom: schedule.effectiveFrom.slice(0, 10),
          effectiveTo: schedule.effectiveTo?.slice(0, 10) ?? null
        });

        for (const day of schedule.days) {
          this.form.get(['days', day.dayOfWeek])?.patchValue(day);
        }
      },
      error: error => this.toastr.error(error.error?.message || 'Unable to load working schedule.')
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const { name, isActive, effectiveFrom, effectiveTo, days } = this.form.getRawValue();
    const dto = { name, isActive, effectiveFrom, effectiveTo, days } as UpdateWorkingScheduleDto;

    this.service.update(this.id, dto).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.router.navigate(['/working-schedule']);
      },
      error: error => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Unable to update working schedule.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/working-schedule']);
  }
}
