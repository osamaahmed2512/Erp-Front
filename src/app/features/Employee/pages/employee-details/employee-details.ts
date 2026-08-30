import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ArrowLeft,
  CalendarDays,
  CircleUserRound,
  Hash,
  LucideAngularModule,
  Mail,
  MapPin,
  Pencil,
  Phone
} from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { AssignmentForm } from '../../Components/assignment-form/assignment-form';
import { AssignmentHistory } from '../../Components/assignment-history/assignment-history';
import { AssignmentSummary } from '../../Components/assignment-summary/assignment-summary';
import { EmployeeDto } from '../../model/employee-dto';
import { EmploymentAssignmentDto } from '../../model/employment-assignment-dto';
import { EmployeeService } from '../../services/employee-service';
import { environment } from '../../../../../environments/environment';
import { EmploymentAssignmentService } from '../../services/employment-assignment-service';

type EmployeeTab = 'overview' | 'assignment';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    AssignmentForm,
    AssignmentHistory,
    AssignmentSummary,
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  readonly icons = {
    ArrowLeft,
    CalendarDays,
    CircleUserRound,
    Hash,
    Mail,
    MapPin,
    Pencil,
    Phone
  };

  employeeId = '';
  employee: EmployeeDto | null = null;
  currentAssignment: EmploymentAssignmentDto | null = null;
  assignmentHistory: EmploymentAssignmentDto[] = [];
  activeTab: EmployeeTab = 'overview';
  profileLoading = true;
  currentLoading = true;
  historyLoading = true;
  showAssignmentForm = false;
  showingLatestAssignment = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly employeeService: EmployeeService,
    private readonly assignmentService: EmploymentAssignmentService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.employeeId) {
      this.router.navigate(['/employee']);
      return;
    }

    this.loadEmployee();
    this.loadAssignments();
  }

  selectTab(tab: EmployeeTab): void {
    this.activeTab = tab;
  }

  openAssignmentForm(): void {
    if (!this.employee?.companyId) {
      this.toastr.error('The employee company could not be determined.');
      return;
    }
    this.showAssignmentForm = true;
  }

  assignmentSaved(): void {
    this.showAssignmentForm = false;
    this.activeTab = 'assignment';
    this.loadAssignments();
  }

  goBack(): void {
    this.router.navigate(['/employee']);
  }

  editEmployee(): void {
    this.router.navigate(['/employee/update', this.employeeId]);
  }

  uploadPhoto(event: Event): void {
    const photo = (event.target as HTMLInputElement).files?.[0];
    if (!photo) return;
    this.employeeService.uploadProfilePhoto(this.employeeId, photo).subscribe({
      next: response => {
        if (this.employee) this.employee.profilePhoto = response.data;
        this.toastr.success(response.message);
      },
      error: error => this.toastr.error(error.error?.message || 'Unable to upload profile photo.')
    });
  }

  get profilePhotoUrl(): string | null {
    if (!this.employee?.profilePhoto) return null;
    return `${environment.apiUrl.replace(/\/api$/, '')}${this.employee.profilePhoto}`;
  }

  get employeeName(): string {
    if (!this.employee) return 'Employee profile';
    return `${this.employee.firstName} ${this.employee.lastName}`.trim();
  }

  get initials(): string {
    if (!this.employee) return '--';
    return `${this.employee.firstName?.[0] ?? ''}${this.employee.lastName?.[0] ?? ''}`.toUpperCase();
  }

  get statusLabel(): string {
    const labels = ['Created', 'Active', 'On leave', 'Suspended', 'Resigned', 'Terminated', 'Retired'];
    return labels[this.employee?.status ?? 0] ?? 'Unknown';
  }

  get genderLabel(): string {
    return this.employee?.gender === 1 ? 'Male' : this.employee?.gender === 2 ? 'Female' : 'Not specified';
  }

  get maritalStatusLabel(): string {
    const labels: Record<number, string> = { 1: 'Single', 2: 'Married', 3: 'Divorced', 4: 'Widowed' };
    return labels[this.employee?.martielStatus ?? 0] ?? 'Not specified';
  }

  private loadEmployee(): void {
    this.profileLoading = true;
    this.employeeService.getById(this.employeeId).subscribe({
      next: response => {
        this.employee = response.data;
        this.profileLoading = false;
      },
      error: error => {
        this.profileLoading = false;
        this.toastr.error(error.error?.message || 'Unable to load employee profile.');
      }
    });
  }

  private loadAssignments(): void {
    this.currentLoading = true;
    this.historyLoading = true;

    this.assignmentService.getCurrent(this.employeeId).subscribe({
      next: response => {
        this.currentAssignment = response.data;
        this.showingLatestAssignment = false;
        this.currentLoading = false;
      },
      error: error => {
        this.currentLoading = false;
        this.applyLatestAssignmentFallback();
        if (error.status !== 404) {
          this.toastr.error(error.error?.message || 'Unable to load the current assignment.');
        }
      }
    });

    this.assignmentService.getHistory(this.employeeId).subscribe({
      next: response => {
        this.assignmentHistory = response.data ?? [];
        this.historyLoading = false;
        this.applyLatestAssignmentFallback();
      },
      error: error => {
        this.assignmentHistory = [];
        this.historyLoading = false;
        this.toastr.error(error.error?.message || 'Unable to load assignment history.');
      }
    });
  }

  private applyLatestAssignmentFallback(): void {
    if (!this.currentAssignment && this.assignmentHistory.length > 0) {
      this.currentAssignment = this.assignmentHistory[0];
      this.showingLatestAssignment = true;
    }
  }
}
