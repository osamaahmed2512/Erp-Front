import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Check, LucideAngularModule, X } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { EmployeeListDto } from '../../model/employee-list-dto';
import { EmploymentAssignmentDto } from '../../model/employment-assignment-dto';
import { EmployeeService } from '../../services/employee-service';
import { EmploymentAssignmentService } from '../../services/employment-assignment-service';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './assignment-form.html',
  styleUrl: './assignment-form.css'
})
export class AssignmentForm implements OnInit {
  @Input({ required: true }) employeeId!: string;
  @Input({ required: true }) companyId!: string;
  @Output() saved = new EventEmitter<EmploymentAssignmentDto>();
  @Output() cancelled = new EventEmitter<void>();

  readonly icons = { Check, X };
  departments: DropDownDto[] = [];
  positions: DropDownDto[] = [];
  managers: EmployeeListDto[] = [];
  loadingOptions = true;
  loadingPositions = false;
  saving = false;

  readonly form = new FormGroup({
    departmentId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    positionId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    managerId: new FormControl<string | null>(null),
    effectiveFrom: new FormControl(this.today(), {
      nonNullable: true,
      validators: Validators.required
    })
  });

  constructor(
    private readonly assignmentService: EmploymentAssignmentService,
    private readonly employeeService: EmployeeService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    this.form.controls.departmentId.valueChanges.subscribe(departmentId => {
      this.form.controls.positionId.reset('');
      this.positions = [];
      if (departmentId) this.loadPositions(departmentId);
    });
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (!this.saving) {
      this.cancelled.emit();
    }
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.assignmentService.create(this.employeeId, this.form.getRawValue()).subscribe({
      next: response => {
        this.saving = false;
        this.toastr.success(response.message, 'Assignment saved');
        this.saved.emit(response.data);
      },
      error: error => {
        this.saving = false;
        this.toastr.error(error.error?.message || 'Unable to save the assignment.', 'Assignment failed');
      }
    });
  }

  private loadOptions(): void {
    let completed = 0;
    const markComplete = () => {
      completed += 1;
      if (completed === 2) this.loadingOptions = false;
    };

    this.assignmentService.getDepartments(this.companyId).subscribe({
      next: data => { this.departments = data; markComplete(); },
      error: error => { this.showOptionError(error); markComplete(); }
    });

    this.employeeService.getAll(1, 250).subscribe({
      next: response => {
        this.managers = response.data.filter(employee =>
          employee.id !== this.employeeId &&
          employee.companyId === this.companyId &&
          employee.status.toLowerCase() === 'active'
        );
        markComplete();
      },
      error: error => { this.showOptionError(error); markComplete(); }
    });
  }

  private loadPositions(departmentId: string): void {
    this.loadingPositions = true;
    this.assignmentService.getPositions(departmentId).subscribe({
      next: data => {
        this.positions = data;
        this.loadingPositions = false;
      },
      error: error => {
        this.loadingPositions = false;
        this.showOptionError(error);
      }
    });
  }

  private showOptionError(error: any): void {
    this.toastr.error(error.error?.message || 'Some assignment options could not be loaded.');
  }

  private today(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
