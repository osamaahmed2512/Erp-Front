import { Component } from '@angular/core';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { EmployeeListDto } from '../../model/employee-list-dto';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee-service';
import { PaginatedResponse } from '../../../../shared/Models/paginated-response';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';

@Component({
  selector: 'app-employee-list',
  imports: [PageHeader, DataTable, CompanyFilter],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  hasPreviousPage = false;
  hasNextPage = false;
  loading = false;
  data: EmployeeListDto[] = [];
  searchTearm = '';
  selectedCompanyId = '';
  searchSubject = new Subject<string>();
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', hidden: true },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'comapnyName', label: 'Company Name' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'nationalityNumber', label: 'Nationality Number' },
    { key: 'status', label: 'Status' }
  ]
constructor(private router:Router , private emp:EmployeeService, readonly access: AccessStore) {

}

  ngOnInit(): void {
  this.LoadEmployees();
      this.searchSubject.pipe(
        debounceTime(500),
  
        distinctUntilChanged()
      )
        .subscribe(search => {
  
          this.searchTearm = search;
  
          this.currentPage = 1;
  
          this.LoadEmployees();
  
        });
  }
  LoadEmployees(){
    this.loading =true;
    this.emp.getAll(this.currentPage, this.pageSize, this.searchTearm, this.selectedCompanyId)
    .subscribe({
      next:(response:PaginatedResponse<EmployeeListDto>)=>{
          this.data=response.data;
          this.totalItems=response.totalCount;
          this.pageSize= response.pageSize;
          this.currentPage= response.pageIndex;
          this.hasPreviousPage = response.hasPreviousPage;
          this.hasNextPage= response.hasNextPage;
          this.loading=false;
      },error:(err)=>{
         this.loading=false;
         console.error(err); 
      }
    })
  }
  AddEmployee(){
     this.router.navigate(['/employee/add'])
  }
  handleExport(){

  }
  handleSearch(search: string){
    this.searchSubject.next(search.trim());
  }
  filterCompany(companyId: string): void {
    this.selectedCompanyId = companyId;
    this.currentPage = 1;
    this.LoadEmployees();
  }

  onView(item: any) {
    this.router.navigate(['/employee', item.id]);
  }

  onEdit(id: string) {
    this.router.navigate(['/employee/update', id]);
  }
  onDelete(item: any) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      console.log('Delete company:', item);
      // TODO: Call delete API
    }
  }
  onPageChange(page:number){
     this.currentPage=page;
     this.LoadEmployees();
  }
  onPageSizeChange(size:number){
    this.pageSize=size;
    this.LoadEmployees();
  }
}
