import { Routes } from '@angular/router';
import { MainLayout } from './layout/components/main-layout/main-layout';
import { authGuard } from './Core/guards/auth-guard';
import { defaultRouteGuard, permissionGuard } from './Core/guards/permission-guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/Pages/login.component/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayout,
    children: [
      {
        path: 'company/create',
        canActivate: [permissionGuard], data: { permission: 'Companies.Create' },
        loadComponent: () =>
          import('./features/Company/Pages/company-create/company-create')
            .then(m => m.CompanyCreate)
      },
      {
        path: 'company', // This must match the 'route' property in your sidebar array
        canActivate: [permissionGuard], data: { permission: 'Companies.View' },
        loadComponent: () => import('./features/Company/Pages/company-component/company-component').then(m => m.CompanyComponent)
      },
      {
        path: 'company/edit/:id',
        canActivate: [permissionGuard], data: { permission: 'Companies.Edit' },
        loadComponent: () => import('./features/Company/Pages/company.update/company.update').then(m => m.CompanyUpdate)
      },
      {
        path: 'departement',
        canActivate: [permissionGuard], data: { permission: 'Departments.View' },
        loadComponent: () => import('./features/Departement/pages/departement-list/departement-list').then(m => m.DepartementList)
      }
      ,
      {
        path: 'departement/create',
        canActivate: [permissionGuard], data: { permission: 'Departments.Create' },
        loadComponent: () => import('./features/Departement/pages/departement-create/departement-create').then(m => m.DepartementCreate)
      }
      ,
      {
        path: 'departement/update/:id',
        canActivate: [permissionGuard], data: { permission: 'Departments.Edit' },
        loadComponent: () => import('./features/Departement/pages/departement-update/departement-update').then(m => m.DepartementUpdate)
      }
      ,
      {
        path: 'position',
        canActivate: [permissionGuard], data: { permission: 'Positions.View' },
        loadComponent: () => import('./features/Position/pages/position-list/position-list').then(m => m.PositionList)
      },
      {
        path: 'position/create',
        canActivate: [permissionGuard], data: { permission: 'Positions.Create' },
        loadComponent: () => import('./features/Position/pages/position-create/position-create').then(m => m.PositionCreate)
      },
      {
        path: 'position/update/:id',
        canActivate: [permissionGuard], data: { permission: 'Positions.Edit' },
        loadComponent: () => import('./features/Position/pages/position-update/position-update').then(m => m.PositionUpdate)
      },
      {
        path: 'working-schedule',
        canActivate: [permissionGuard], data: { permission: 'WorkingSchedules.View' },
        loadComponent: () => import('./features/WorkingSchedule/pages/working-schedule-list/working-schedule-list').then(m => m.WorkingScheduleList)
      },
      {
        path: 'working-schedule/create',
        canActivate: [permissionGuard], data: { permission: 'WorkingSchedules.Create' },
        loadComponent: () => import('./features/WorkingSchedule/pages/working-schedule-create/working-schedule-create').then(m => m.WorkingScheduleCreate)
      },
      {
        path: 'working-schedule/update/:id',
        canActivate: [permissionGuard], data: { permission: 'WorkingSchedules.Edit' },
        loadComponent: () => import('./features/WorkingSchedule/pages/working-schedule-update/working-schedule-update').then(m => m.WorkingScheduleUpdate)
      },
      {
        path: 'work-entry-type',
        canActivate: [permissionGuard], data: { permission: 'WorkEntryTypes.View' },
        loadComponent: () => import('./features/WorkEntryType/Pages/working-type-list/working-type-list').then(m => m.WorkingTypeList)
      },
      {
        path: 'work-entry-type/create',
        canActivate: [permissionGuard], data: { permission: 'WorkEntryTypes.Create' },
        loadComponent: () => import('./features/WorkEntryType/Pages/working-type-create/working-type-create').then(m => m.WorkingTypeCreate)
      },
      {
        path: 'work-entry-type/update/:id',
        canActivate: [permissionGuard], data: { permission: 'WorkEntryTypes.Edit' },
        loadComponent: () => import('./features/WorkEntryType/Pages/working-type-update/working-type-update').then(m => m.WorkingTypeUpdate)
      },
            
      {
        path: 'structure-type',
        canActivate: [permissionGuard], data: { permission: 'StructureTypes.View' },
        loadComponent: () => import('./features/StructureType/pages/structure-type-list/structure-type-list').then(m => m.StructureTypeList)
      },
      {
        path: 'structure-type/add',
        canActivate: [permissionGuard], data: { permission: 'StructureTypes.Create' },
        loadComponent: () => import('./features/StructureType/pages/structure-type-create/structure-type-create').then(m => m.StructureTypeCreate)
      },
      {
        path: 'structure-type/update/:id',
        canActivate: [permissionGuard], data: { permission: 'StructureTypes.Edit' },
        loadComponent: () => import('./features/StructureType/pages/structure-type-update/structure-type-update').then(m => m.StructureTypeUpdate)
      },
      {
        path: 'salary-rule-category',
        canActivate: [permissionGuard], data: { permission: 'SalaryRuleCategories.View' },
        loadComponent: () => import('./features/SalaryRuleCategory/pages/salary-rule-category-list/salary-rule-category-list').then(m => m.SalaryRuleCategoryList)
      },
      {
        path: 'salary-rule-category/add',
        canActivate: [permissionGuard], data: { permission: 'SalaryRuleCategories.Create' },
        loadComponent: () => import('./features/SalaryRuleCategory/pages/salary-rule-category-create/salary-rule-category-create').then(m => m.SalaryRuleCategoryCreate)
      },
      {
        path: 'salary-rule-category/update/:id',
        canActivate: [permissionGuard], data: { permission: 'SalaryRuleCategories.Edit' },
        loadComponent: () => import('./features/SalaryRuleCategory/pages/salary-rule-category-update/salary-rule-category-update').then(m => m.SalaryRuleCategoryUpdate)
      },
      {
        path: 'employee',
        canActivate: [permissionGuard], data: { permission: 'Employees.View' },
        loadComponent: () => import('./features/Employee/pages/employee-list/employee-list').then(m => m.EmployeeList)
      }
      ,
      {
        path: 'employee/add',
        canActivate: [permissionGuard], data: { permission: 'Employees.Create' },
        loadComponent: () => import('./features/Employee/pages/employee-create/employee-create').then(m => m.EmployeeCreate)
      },
      {
        path: 'employee/update/:id',
        canActivate: [permissionGuard], data: { permission: 'Employees.Edit' },
        loadComponent: () => import('./features/Employee/pages/employee-update/employee-update').then(m => m.EmployeeUpdate)
      },
      {
        path: 'employee/:id',
        canActivate: [permissionGuard], data: { permission: 'Employees.View' },
        loadComponent: () => import('./features/Employee/pages/employee-details/employee-details').then(m => m.EmployeeDetails)
      },

      {
        path: 'admin/access-control',
        canActivate: [permissionGuard], data: { permission: 'AccessControl.View' },
        loadComponent: () => import('./features/AccessControl/pages/access-control/access-control').then(m => m.AccessControlPage)
      },
      {
        path: 'admin/system-access-control',
        canActivate: [permissionGuard], data: { permission: 'SystemRoles.View' },
        loadComponent: () => import('./features/AccessControl/pages/access-control/access-control').then(m => m.AccessControlPage)
      },
      {
        path: 'access-denied',
        loadComponent: () => import('./shared/components/access-denied/access-denied').then(m => m.AccessDenied)
      },
      { path: '', canActivate: [defaultRouteGuard], children: [] }
    ]
  }
];
