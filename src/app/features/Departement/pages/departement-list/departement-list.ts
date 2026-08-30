import { Component } from '@angular/core';

import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { PageHeader } from "../../../../shared/components/page-header/page-header";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { Router } from '@angular/router';
import { DeptService } from '../../Services/dept.service';
import { PaginatedResponse } from '../../../../shared/Models/paginated-response';
import { GetAllDepartementsDto } from '../../Models/get-all-departements-dto';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';

@Component({
  selector: 'app-departement-list',
  imports: [PageHeader, DataTable, CompanyFilter],
  templateUrl: './departement-list.html',
  styleUrl: './departement-list.css',
})
export class DepartementList {
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  hasPreviousPage = false;
  hasNextPage = false;
  loading = false;
  data: GetAllDepartementsDto[] = [];
  searchTearm = '';
  selectedCompanyId = '';
  searchSubject = new Subject<string>();

  /**
   *
   */ 
  constructor(private router: Router, private departement: DeptService, readonly access: AccessStore) {


  }

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'totalEmployees', label: 'Total Employees' },
    {
      key: 'status', label: 'Status'
      , badge: true

      , badgeClass: (value: string) => {
        return value.toLowerCase() === 'active'
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-red-100 text-red-700 border border-red-200';
      },
      clickable:true
    }
  ]



  ngOnInit(): void {
    this.loadDepartements();
    this.searchSubject.pipe(
      debounceTime(500),

      distinctUntilChanged()
    )
      .subscribe(search => {

        this.searchTearm = search;

        this.currentPage = 1;

        this.loadDepartements();

      });
  }

  loadDepartements() {
    this.loading = true;
    this.departement.getAll(this.currentPage, this.pageSize, this.searchTearm, this.selectedCompanyId)
      .subscribe({
        next: (response: PaginatedResponse<GetAllDepartementsDto>) => {
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

  filterCompany(companyId: string): void {
    this.selectedCompanyId = companyId;
    this.currentPage = 1;
    this.loadDepartements();
  }


  handleAddDepartement() {
    this.router.navigate(['/departement/create'])
  }


  onPageChange(page: number) {
    this.currentPage = page;
    this.loadDepartements();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadDepartements();
  }
  // Action Handlers
  onView(item: any) {
    console.log('View company:', item);
  }

  onEdit(id: string) {
    this.router.navigate(['/departement/update', id]);
  }

  onDelete(item: any) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      console.log('Delete company:', item);
      // TODO: Call delete API
    }
  }
  handleExport() {
    console.log('Exporting CSV...');
  }


  handleSearch(search: string) {
    this.searchSubject.next(search.trim());
  }
  changeStatus(id:string){
    this.departement.updateStatus(id)
    .subscribe({
       next:()=>{
           this.loadDepartements();
       }
    })
  }
  // Optional handlers
  onFilter() { console.log('Filter clicked'); }
}
