import { Component } from '@angular/core';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { GetStructureType } from '../../models/get-sturcture-type';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TableColumn } from '../../../../shared/Models/table-column.interface';
import { Router } from '@angular/router';
import { StructureTypeService } from '../../Services/structure-type.service';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { PaginatedResponse } from '../../../../shared/Models/paginated-response';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';


@Component({
  selector: 'app-structure-type-list',
  imports: [DataTable, PageHeader, CompanyFilter],
  templateUrl: './structure-type-list.html',
  styleUrl: './structure-type-list.css',
})
export class StructureTypeList {
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  hasPreviousPage = false;
  hasNextPage = false;
  loading = false;
  data: GetStructureType[] = [];
  searchTearm = '';
  selectedCompanyId = '';
  searchSubject = new Subject<string>();
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Last Name' },
    { key: 'code', label: 'Code' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'status', label: 'Status', }
  ]
constructor(private router:Router , private struct:StructureTypeService, readonly access: AccessStore) {

}

  ngOnInit(): void {
  this.LoadStructureypes();
      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
        .subscribe(search => {
  
          this.searchTearm = search;
  
          this.currentPage = 1;
  
          this.LoadStructureypes();
  
        });
  }
  LoadStructureypes(){
    this.loading =true;
    this.struct.getAll(this.currentPage, this.pageSize, this.searchTearm, this.selectedCompanyId)
    .subscribe({
      next:(response:PaginatedResponse<GetStructureType>)=>{
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
  AddStructureTypes(){
     this.router.navigate(['/structure-type/add'])
  }
  handleExport(){

  }
  handleSearch(search: string){
    this.searchSubject.next(search.trim());
  }
  filterCompany(companyId: string): void {
    this.selectedCompanyId = companyId;
    this.currentPage = 1;
    this.LoadStructureypes();
  }

  onView(item: any) {
    this.router.navigate(['/structure-type', item.id]);
  }

  onEdit(id: string) {
    this.router.navigate(['/structure-type/update', id]);
  }
  onDelete(item: any) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      console.log('Delete company:', item);
      // TODO: Call delete API
    }
  }
  onPageChange(page:number){
     this.currentPage=page;
     this.LoadStructureypes();
  }
  onPageSizeChange(size:number){
    this.pageSize=size;
    this.LoadStructureypes();
  }
}
