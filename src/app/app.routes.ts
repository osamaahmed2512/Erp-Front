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
