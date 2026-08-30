import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { WorkingScheduleListDto } from '../../models/working-schedule.models';
import { WorkingScheduleService } from '../../services/working-schedule.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';

type WorkingScheduleRow = WorkingScheduleListDto & {
  status: string;
  effectiveFromDate: string;
  effectiveToDate: string;
};

@Component({
  selector: 'app-working-schedule-list',
  standalone: true,
  imports: [DataTable, PageHeader, CompanyFilter],
  templateUrl: './working-schedule-list.html',
  styleUrl: './working-schedule-list.css'
})
export class WorkingScheduleList implements OnInit, OnDestroy {
  data: WorkingScheduleRow[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  hasPreviousPage = false;
  hasNextPage = false;
  selectedCompanyId = '';

  private searchTerm = '';
  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Schedule' },
    { key: 'companyName', label: 'Company' },
    { key: 'effectiveFromDate', label: 'Effective From' },
    { key: 'effectiveToDate', label: 'Effective To' },
    { key: 'workingDays', label: 'Working Days' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      clickable: true,
      badgeClass: value => value === 'Active'
        ? 'bg-green-100 text-green-700 border border-green-200'
        : 'bg-slate-100 text-slate-600 border border-slate-200'
    }
  ];

  constructor(
    private readonly service: WorkingScheduleService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    readonly access: AccessStore
  ) {}

  ngOnInit(): void {
    this.search$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerm = value;
        this.currentPage = 1;
        this.load();
      });

    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.service.getAll(this.currentPage, this.pageSize, this.searchTerm, this.selectedCompanyId).subscribe({
      next: response => {
        this.data = response.data.map(item => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
          effectiveFromDate: item.effectiveFrom.slice(0, 10),
          effectiveToDate: item.effectiveTo?.slice(0, 10) ?? 'No end date'
        }));
        this.totalItems = response.totalCount;
        this.currentPage = response.pageIndex;
        this.pageSize = response.pageSize;
        this.hasPreviousPage = response.hasPreviousPage;
        this.hasNextPage = response.hasNextPage;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.toastr.error(error.error?.message || 'Unable to load working schedules.');
      }
    });
  }

  filterCompany(companyId: string): void {
    this.selectedCompanyId = companyId;
    this.currentPage = 1;
    this.load();
  }

  add(): void {
    this.router.navigate(['/working-schedule/create']);
  }

  view(item: WorkingScheduleRow): void {
    this.edit(item.id);
  }

  edit(id: string): void {
    this.router.navigate(['/working-schedule/update', id]);
  }

  search(value: string): void {
    this.search$.next(value.trim());
  }

  pageChanged(page: number): void {
    this.currentPage = page;
    this.load();
  }

  pageSizeChanged(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.load();
  }

  changeStatus(id: string): void {
    const item = this.data.find(value => value.id === id);
    if (!item) return;

    this.service.changeStatus(id, !item.isActive).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.load();
      },
      error: error => this.toastr.error(error.error?.message || 'Unable to change status.')
    });
  }

  remove(id: string): void {
    const item = this.data.find(value => value.id === id);
    if (!item || !confirm(`Delete ${item.name}?`)) return;

    this.service.delete(id).subscribe({
      next: response => {
        this.toastr.success(response.message);
        this.load();
      },
      error: error => this.toastr.error(error.error?.message || 'Unable to delete working schedule.')
    });
  }

  exportCsv(): void {
    const headings = ['Schedule', 'Company', 'Effective From', 'Effective To', 'Working Days', 'Status'];
    const rows = this.data.map(item => [
      item.name,
      item.companyName,
      item.effectiveFromDate,
      item.effectiveToDate,
      item.workingDays,
      item.status
    ]);
    const csv = [headings, ...rows]
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');

    link.href = url;
    link.download = 'working-schedules.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
