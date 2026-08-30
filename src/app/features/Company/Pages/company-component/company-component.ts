import { Component, OnInit } from '@angular/core';


import { CompanyService } from '../../Services/company.service';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { GetAllCompaniesDto } from '../../Models/get-all-companies.dto';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { PaginatedResponse } from '../../../../shared/Models/paginated-response';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PageHeader } from "../../../../shared/components/page-header/page-header";
import { AccessStore } from '../../../../Core/services/access-store.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [DataTable, PageHeader],
  templateUrl: './company-component.html'
})
export class CompanyComponent implements OnInit {
  data: GetAllCompaniesDto[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  hasPreviousPage = false;
  hasNextPage = false;
  loading = false;
  searchTearm = '';
  searchSubject = new Subject<string>();
  columns: TableColumn[] = [
    { key: 'id', label: 'ID',hidden:true},
    { key: 'name', label: 'Company' },
    { key: 'phone', label: 'Phone' },        // adjust according to your DTO
    { key: 'email', label: 'Email' },
    { key: 'ownerName', label: 'OwnerName' },
    { key: 'totalEmployees', label: 'TotalEmployees' },
    {
      key: 'status'
      , label: 'Status'
      , badge: true
      , badgeClass: (value: string) => {
        return value === 'Active'
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-red-100 text-red-700 border border-red-200';
      }
    }
  ];

  constructor(private company: CompanyService, private router: Router, readonly access: AccessStore) { }

  ngOnInit() {
    this.loadCompanies();
    this.searchSubject.pipe(
      debounceTime(500),

      distinctUntilChanged()
    )
      .subscribe(search => {

        this.searchTearm = search;

        this.currentPage = 1;

        this.loadCompanies();

      });
  }

  loadCompanies() {
    this.loading = true;
    this.company.GetAll(this.currentPage, this.pageSize, this.searchTearm)
      .subscribe({
        next: (response: PaginatedResponse<GetAllCompaniesDto>) => {
          this.data = response.data;
          this.totalItems = response.totalCount;
          this.pageSize = response.pageSize;
          this.currentPage = response.pageIndex;
          this.hasPreviousPage = response.hasPreviousPage;
          this.hasNextPage = response.hasNextPage;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCompanies();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadCompanies();
  }
  // Action Handlers
  onView(item: any) {
    console.log('View company:', item);
  }

  onEdit(id:string) {
    debugger;
    this.router.navigate(['/company/edit',id]);
  }

  onDelete(id: string) {
    this.company.delete(id).subscribe({
      next:()=>{

      }
    });
  }
  handleExport() {
    console.log('Exporting CSV...');
  }

  handleAddCompany() {
    this.router.navigate(['/company/create'])
  }
  handleSearch(search: string) {
    this.searchSubject.next(search.trim());
  }
  // Optional handlers
  onFilter() { console.log('Filter clicked'); }
}
