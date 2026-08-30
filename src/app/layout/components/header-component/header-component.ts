import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Bell, ChevronRight, LogOut } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular/src/icons';
import { filter } from 'rxjs/operators';
import { TokenService } from '../../../Core/services/token.service';
import { AccessStore } from '../../../Core/services/access-store.service';

interface Breadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit {
  icons = { Bell, ChevronRight, LogOut };
  breadcrumbs: Breadcrumb[] = [];

  private readonly crumbMap: Record<string, Breadcrumb[]> = {
    '/departement': [
      { label: 'HR Module' },
      { label: 'Settings' },
      { label: 'Departments' },
    ],
    '/departement/create': [
      { label: 'HR Module' },
      { label: 'Settings' },
      { label: 'Departments', route: '/departement' },
      { label: 'Create' },
    ],
    '/company': [
      { label: 'Others' },
      { label: 'System' },
      { label: 'Company' },
    ],
    '/company/create': [
      { label: 'Others' },
      { label: 'System' },
      { label: 'Company', route: '/company' },
      { label: 'Create' },
    ],
    '/working-schedule': [
      { label: 'HR Module' }, { label: 'Settings' }, { label: 'Working Schedules' },
    ],
    '/working-schedule/create': [
      { label: 'HR Module' }, { label: 'Settings' },
      { label: 'Working Schedules', route: '/working-schedule' }, { label: 'Create' },
    ],
  };

  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService,
    private readonly accessStore: AccessStore
  ) {}

  logout(): void {
    this.accessStore.clear();
    this.tokenService.clear();
    void this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    this.updateCrumbs(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => this.updateCrumbs(e.urlAfterRedirects));
  }

  private updateCrumbs(url: string): void {
    const path = url.split('?')[0];
    if (this.crumbMap[path]) {
      this.breadcrumbs = this.crumbMap[path];
      return;
    }
    if (path.startsWith('/company/edit/')) {
      this.breadcrumbs = [
        { label: 'Others' },
        { label: 'System' },
        { label: 'Company', route: '/company' },
        { label: 'Edit' },
      ];
      return;
    }
    if (path.startsWith('/working-schedule/update/')) {
      this.breadcrumbs = [
        { label: 'HR Module' }, { label: 'Settings' },
        { label: 'Working Schedules', route: '/working-schedule' }, { label: 'Edit' },
      ];
      return;
    }
    this.breadcrumbs = [];
  }
}
