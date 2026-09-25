import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { WorkEntyForm } from '../../Components/work-enty-form/work-enty-form';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownDto } from '../../../../shared/Models/drop-down-dto';
import { WorkentrytypeService } from '../../services/workentrytype.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccessStore } from '../../../../Core/services/access-store.service';
import { Subject, takeUntil } from 'rxjs';
import { DepartementService } from '../../../../Core/services/departement-service';
import { CreateWorkEntryDto } from '../../Models/create-work-entry-dto';

@Component({
  selector: 'app-working-type-create',
  imports: [CreatePageComponent,WorkEntyForm],
  templateUrl: './working-type-create.html',
  styleUrl: './working-type-create.css',
})
export class WorkingTypeCreate implements OnInit ,OnDestroy{
readonly form = new FormGroup({
  name:new FormControl('',{nonNullable:true,validators:Validators.required}),
  code:new FormControl('',{nonNullable:true,validators:Validators.required}),
  isPaid:new FormControl(false,{nonNullable:true,validators:Validators.required}),
  isWorkingTime:new FormControl(false,{nonNullable:true,validators:Validators.required}),
  companyId:new FormControl('',{nonNullable:true,validators:Validators.required}),
})
  isSuperAdmin = false;
  companies: DropDownDto[] = [];
  loadingCompanies = false;
  isSaving = false;

 private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly service:WorkentrytypeService,
    private readonly accessStore: AccessStore,
    private readonly router: Router,
    private readonly deptService:DepartementService,
    private readonly toastr: ToastrService
  ) 
  {}
  
ngOnInit(): void {
  this.isSuperAdmin = this.accessStore.isSystemUser();
  if(this.isSuperAdmin){
    this.loadCompanies()
  }
}
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
private loadCompanies():void{
  this.loadingCompanies =true;
  this.deptService.getDropDown().subscribe({
    next:data=>{
       this.companies =data;
       this.loadingCompanies =false;
    },
    error:err =>{
      this.loadingCompanies =false;
      this.toastr.error(err.error?.message ||'Unable To Load Companies');
    }
  })
}
save():void{
   if(this.form.invalid||(this.isSuperAdmin&&!this.form.controls.companyId.value))
    {
       this.form.markAllAsTouched();
       return;
    }
    this.isSaving = true;
    const value = this.form.getRawValue();
    
    const dto:CreateWorkEntryDto = {
      name :value.name,
      code:value.code,
      companyId:value.companyId,
      isPaid:value.isPaid,
      isActive:true,
      isWorkingTime:value.isWorkingTime,
    }
    this.service.create(dto).subscribe({
      next:()=>{
        this.isSaving =false;
        this.toastr.success(`work entry Created Successfully`);
        this.router.navigate(['/work-entry-type']);
      },
      error:err=>{
        console.log(err);
        this.isSaving = false;
        this.toastr.error(err.error?.message||'unable to add Work Entry');
      }
    })
    

}
cancel(){
   this.router.navigate(['/work-entry-type']);
}
}
