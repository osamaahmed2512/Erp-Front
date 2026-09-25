import { Component } from '@angular/core';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { PositionListDto } from '../../../Position/models/position.models';
import { GetWorkEnrtyDto } from '../../Models/get-work-enrty-dto';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { WorkentrytypeService } from '../../services/workentrytype.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';

@Component({
  selector: 'app-working-type-list',
  imports: [PageHeader,DataTable,CompanyFilter],
  templateUrl: './working-type-list.html',
  styleUrl: './working-type-list.css',
})
export class WorkingTypeList {
  data: GetWorkEnrtyDto[] = [];
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
    { key: 'id', label: 'id',hidden:true },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'isPaid', label: 'Is Paid' },
    { key: 'isWorkingTime', label: 'Is Working Time' },
    { key: 'status',  label: 'Status',} 
  ];

  constructor(
    private readonly entryService: WorkentrytypeService,
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
    this.entryService.getAll(this.currentPage, this.pageSize, this.searchTerm, this.selectedCompanyId).subscribe({
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

  add(): void { this.router.navigate(['/work-entry-type/create']); }
  view(item: PositionListDto): void { this.router.navigate(['/work-entry-type/update', item.id]); }
  edit(id: string): void { this.router.navigate(['/work-entry-type/update', id]); }
  search(value: string): void { this.search$.next(value.trim()); }
  pageChanged(page: number): void { 
    debugger;
    this.currentPage = page; this.load();
   }
  pageSizeChanged(size: number): void {
        debugger;
     this.pageSize = size; this.currentPage = 1; this.load(); }


  remove(id: string): void {
    const item = this.data.find(entry => entry.id === id);
    if (!item) return;
    if (!confirm(`Delete ${item.name}?`)) return;
    this.entryService.Delete(item.id).subscribe({
      next: response => { this.toastr.success(response.message); this.load(); },
      error: error => this.toastr.error(error.error?.message || 'Unable to delete position.')
    });
  }

  exportCsv(): void {
    const rows = this.data.map(item => [item.name, item.code, item.isPaid, item.isWorkingTime,item.status]);
    const csv = [['Name', 'Code', 'Is Pasid','isWorkingTime','Status'], ...rows]
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
