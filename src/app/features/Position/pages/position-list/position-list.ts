import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { PositionListDto } from '../../models/position.models';
import { PositionService } from '../../services/position.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';

@Component({
  selector: 'app-position-list',
  standalone: true,
  imports: [DataTable, PageHeader, CompanyFilter],
  templateUrl: './position-list.html',
  styleUrl: './position-list.css'
})
export class PositionList implements OnInit, OnDestroy {
  data: PositionListDto[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  hasPreviousPage = false;
  hasNextPage = false;
  searchTerm = '';
  selectedCompanyId = '';
  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly columns: TableColumn[] = [
    { key: 'title', label: 'Position' },
    { key: 'departmentName', label: 'Department' },
    { key: 'companyName', label: 'Company' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      clickable: true,
      badgeClass: value => value.toLowerCase() === 'active'
        ? 'bg-green-100 text-green-700 border border-green-200'
        : 'bg-slate-100 text-slate-600 border border-slate-200'
    }
  ];

  constructor(
    private readonly positionService: PositionService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    readonly access: AccessStore
  ) {}

  ngOnInit(): void {
    this.search$.pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(search => {
        this.searchTerm = search;
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
    this.positionService.getAll(this.currentPage, this.pageSize, this.searchTerm, this.selectedCompanyId).subscribe({
      next: response => {
        this.data = response.data;
        this.totalItems = response.totalCount;
        this.currentPage = response.pageIndex;
        this.pageSize = response.pageSize;
        this.hasPreviousPage = response.hasPreviousPage;
        this.hasNextPage = response.hasNextPage;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.toastr.error(error.error?.message || 'Unable to load positions.');
      }
    });
  }

  filterCompany(companyId: string): void {
    this.selectedCompanyId = companyId;
    this.currentPage = 1;
    this.load();
  }

  add(): void { this.router.navigate(['/position/create']); }
  view(item: PositionListDto): void { this.router.navigate(['/position/update', item.id]); }
  edit(id: string): void { this.router.navigate(['/position/update', id]); }
  search(value: string): void { this.search$.next(value.trim()); }
  pageChanged(page: number): void { this.currentPage = page; this.load(); }
  pageSizeChanged(size: number): void { this.pageSize = size; this.currentPage = 1; this.load(); }

  changeStatus(id: string): void {
    const position = this.data.find(item => item.id === id);
    if (!position) return;
    const nextStatus = position.status.toLowerCase() === 'active' ? 'inactive' : 'active';
    this.positionService.changeStatus(id, nextStatus).subscribe({
      next: response => { this.toastr.success(response.message); this.load(); },
      error: error => this.toastr.error(error.error?.message || 'Unable to change position status.')
    });
  }

  remove(id: string): void {
    const item = this.data.find(position => position.id === id);
    if (!item) return;
    if (!confirm(`Delete ${item.title}?`)) return;
    this.positionService.delete(item.id).subscribe({
      next: response => { this.toastr.success(response.message); this.load(); },
      error: error => this.toastr.error(error.error?.message || 'Unable to delete position.')
    });
  }

  exportCsv(): void {
    const rows = this.data.map(item => [item.title, item.departmentName, item.companyName, item.status]);
    const csv = [['Position', 'Department', 'Company', 'Status'], ...rows]
      .map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'positions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
