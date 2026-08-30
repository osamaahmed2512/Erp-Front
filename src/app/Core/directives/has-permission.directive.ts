import { Directive, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AccessStore } from '../services/access-store.service';

@Directive({ selector: '[appHasPermission]', standalone: true })
export class HasPermissionDirective {
  private permission = '';
  @Input() set appHasPermission(value: string) { this.permission = value; this.render(); }
  constructor(private template: TemplateRef<unknown>, private view: ViewContainerRef, private access: AccessStore) {
    effect(() => { this.access.access(); this.render(); });
  }
  private render(): void {
    this.view.clear();
    if (this.permission && this.access.can(this.permission)) this.view.createEmbeddedView(this.template);
  }
}
