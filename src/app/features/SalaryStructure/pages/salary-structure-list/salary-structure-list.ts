import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { PaginatedResponse } from '../../../../shared/Models/paginated-response';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { SalaryStructureService } from '../../Services/salary-structure.service';
import { GetSalaryStructure } from '../../models/get-salary-structure';

@Component({
  selector: 'app-salary-structure-list',
  imports: [DataTable, PageHeader, CompanyFilter],
  templateUrl: './salary-structure-list.html',
})
export class SalaryStructureList implements OnInit, OnDestroy {
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  hasPreviousPage = false;
  hasNextPage = false;
  loading = false;
  data: GetSalaryStructure[] = [];
  searchTerm = '';
  selectedCompanyId = '';

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'structureTypeName', label: 'Structure Type' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'status', label: 'Status' },
  ];

  constructor(
    private router: Router,
    private salaryStructureService: SalaryStructureService,
    private toastr: ToastrService,
    readonly access: AccessStore
  ) {}

  ngOnInit(): void {
    this.load();
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.searchTerm = search;
        this.currentPage = 1;
        this.load();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.salaryStructureService
      .getAll(this.currentPage, this.pageSize, this.searchTerm, this.selectedCompanyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<GetSalaryStructure>) => {
          this.data = response.data;
          this.totalItems = response.totalCount;
          this.pageSize = response.pageSize;
          this.currentPage = response.pageIndex;
          this.hasPreviousPage = response.hasPreviousPage;
          this.hasNextPage = response.hasNextPage;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(err.error?.message || 'Unable to load salary structures.');
        },
      });
  }

  onAdd(): void {
    this.router.navigate(['/salary-structure/add']);
  }

  handleSearch(search: string): void {
    this.searchSubject.next(search.trim());
  }

  filterCompany(companyId: string): void {
    this.selectedCompanyId = companyId;
    this.currentPage = 1;
    this.load();
  }

  onEdit(id: string): void {
    this.router.navigate(['/salary-structure/update', id]);
  }

  onDelete(id: string): void {
    const item = this.data.find((x) => x.id === id);
    if (!confirm(`Are you sure you want to delete ${item?.name ?? 'this salary structure'}?`)) return;

    this.salaryStructureService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        if (this.data.length === 1 && this.currentPage > 1) this.currentPage--;
        this.load();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Unable to delete salary structure.'),
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.load();
  }
}
