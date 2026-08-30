import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EmploymentAssignmentDto } from '../../model/employment-assignment-dto';

@Component({
  selector: 'app-assignment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-history.html',
  styleUrl: './assignment-history.css'
})
export class AssignmentHistory {
  @Input() assignments: EmploymentAssignmentDto[] = [];
  @Input() loading = false;

  statusFor(assignment: EmploymentAssignmentDto): 'Current' | 'Scheduled' | 'Historical' {
    const today = this.today();
    if (assignment.effectiveFrom > today) return 'Scheduled';
    if (!assignment.effectiveTo || assignment.effectiveTo >= today) return 'Current';
    return 'Historical';
  }

  private today(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
