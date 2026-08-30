import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BriefcaseBusiness, Building2, CalendarDays, LucideAngularModule, Plus, UserRound } from 'lucide-angular';
import { EmploymentAssignmentDto } from '../../model/employment-assignment-dto';

@Component({
  selector: 'app-assignment-summary',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './assignment-summary.html',
  styleUrl: './assignment-summary.css'
})
export class AssignmentSummary {
  @Input() assignment: EmploymentAssignmentDto | null = null;
  @Input() loading = false;
  @Output() createAssignment = new EventEmitter<void>();

  readonly icons = { BriefcaseBusiness, Building2, CalendarDays, Plus, UserRound };
}
