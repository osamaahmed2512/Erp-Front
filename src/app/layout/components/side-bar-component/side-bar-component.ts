import { CommonModule } from '@angular/common';
import { Component, OnInit, effect } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular/src/icons';
import { MenuModule } from '../../../shared/Models/menu-module';
import { MenuCategories } from '../../../shared/Models/menu-categories';
import { filter } from 'rxjs/operators';
import { AccessStore } from '../../../Core/services/access-store.service';

@Component({
  selector: 'app-side-bar-component',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './side-bar-component.html',
  styleUrl: './side-bar-component.css',
})
export class SideBarComponent implements OnInit {

  activeModuleName: string | null = null;

  modules: MenuModule[] = [];

  constructor(private router: Router, private accessStore: AccessStore) {
    effect(() => {
      const pages = this.accessStore.pages();
      const modules = new Map<string, MenuModule>();
      for (const page of pages) {
        let module = modules.get(page.module);
        if (!module) {
          module = {
            name: page.module,
            icon: this.getModuleIcon(page.module),
            expanded: false,
            categories: []
          };
          modules.set(page.module, module);
        }
        let category = module.categories.find(x => x.name === page.category);
        if (!category) {
          category = { name: page.category, expanded: true, pages: [] };
          module.categories.push(category);
        }
        category.pages.push({ name: page.name, route: page.route, icon: page.icon });
      }
      this.modules = [...modules.values()];
      this.detectActiveModule(this.router.url);
    });
  }

  private getModuleIcon(moduleName: string): string {
    const icons: Record<string, string> = {
      'System': 'settings',
      'Administration': 'shield-check',
      'HR Module': 'users'
    };
    return icons[moduleName] ?? 'layout-grid';
  }

  ngOnInit(): void {
    this.detectActiveModule(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.detectActiveModule(e.urlAfterRedirects);
    });
  }

  private detectActiveModule(url: string): void {
    const path = url.split('?')[0];
    for (const mod of this.modules) {
      for (const cat of mod.categories) {
        for (const page of cat.pages) {
          if (path.startsWith(page.route)) {
            this.activeModuleName = mod.name;
            return;
          }
        }
      }
    }
  }

  get activeModule(): MenuModule | null {
    return this.modules.find(m => m.name === this.activeModuleName) ?? null;
  }

  toggleModule(mod: MenuModule): void {
    this.activeModuleName = this.activeModuleName === mod.name ? null : mod.name;
  }

  toggleCategory(cat: MenuCategories): void {
    cat.expanded = !cat.expanded;
  }
}
