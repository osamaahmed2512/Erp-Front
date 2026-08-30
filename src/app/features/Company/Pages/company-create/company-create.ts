import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePageComponent } from '../../../../shared/components/create-page.component/create-page.component';
import { CompanyFormComponent } from "../../Components/company.form.component/company.form.component";
import { AccessControlService } from '../../../AccessControl/services/access-control.service';
import { CompanyModule, CreateCompanyWithOwnerRequest } from '../../../AccessControl/models/access-control.models';



@Component({
  selector: 'app-company-create',
  imports: [CommonModule, ReactiveFormsModule, CreatePageComponent, CompanyFormComponent],
  templateUrl: './company-create.html',
  styleUrl: './company-create.css',
  standalone: true
})
export class CompanyCreate {
  companyForm!: FormGroup;
  modules: CompanyModule[] = [];
  modulesLoading = false;
  modulesError = '';
  constructor(
    private accessControlService: AccessControlService,
    private router: Router) {


  }
  ngOnInit() {

    this.buildForm();
    this.loadModules();
  }

  isSaving = false;

  buildForm() {
    this.companyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      description: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl(''),
      taxNumber: new FormControl(''),
      commercialRegistration: new FormControl(''),
      website: new FormControl(''),
      ownerFirstName: new FormControl('', Validators.required),
      ownerLastName: new FormControl('', Validators.required),
      ownerEmail: new FormControl('', [Validators.required, Validators.email]),
      ownerPhone: new FormControl(''),
      ownerPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      enabledModules: new FormControl<string[]>([], Validators.required)
    });

  }

  loadModules(): void {
    this.modulesLoading = true;
    this.modulesError = '';
    this.accessControlService.getCompanyModules().subscribe({
      next: modules => {
        this.modules = modules;
        this.modulesLoading = false;
      },
      error: () => {
        this.modulesLoading = false;
        this.modulesError = 'Unable to load company modules.';
      }
    });
  }

  toggleModule(moduleName: string, enabled: boolean): void {
    const control = this.companyForm.controls['enabledModules'];
    const selected = new Set<string>(control.value ?? []);
    enabled ? selected.add(moduleName) : selected.delete(moduleName);
    control.setValue([...selected]);
    control.markAsTouched();
  }

  isModuleSelected(moduleName: string): boolean {
    return (this.companyForm.controls['enabledModules'].value ?? []).includes(moduleName);
  }

  save() {
    debugger;
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    const dto = this.companyForm.getRawValue() as CreateCompanyWithOwnerRequest;
    this.isSaving = true;

    this.accessControlService.createCompanyWithOwner(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/company']);
      },
      error: (err) => {
        console.log(err);
        this.isSaving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/company']);
  }

  goBack() {
    window.history.back();
  }
}
