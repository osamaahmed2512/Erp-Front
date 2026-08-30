import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessStore } from '../../../Core/services/access-store.service';
import { AccessCompany } from '../../../features/AccessControl/models/access-control.models';

@Component({
  selector: 'app-company-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './company-filter.html',
  host: { '[style.display]': 'accessStore.isSystemUser() ? "block" : "none"' }
})
export class CompanyFilter implements OnInit {
  @Input() allowAll = true;
  @Input() label = 'Company';
  @Input() compact = false;
  @Output() companyChange = new EventEmitter<string>();

  query = '';
  selectedCompanyId = '';
  open = false;

  constructor(readonly accessStore: AccessStore) {}

  ngOnInit(): void {
    if (this.allowAll) return;
    const selectedId = this.accessStore.selectedCompanyId();
    const selected = this.accessStore.companies().find(company => company.id === selectedId);
    if (selected) {
      this.selectedCompanyId = selected.id;
      this.query = selected.name;
    }
  }

  get filteredCompanies(): AccessCompany[] {
    const search = this.query.trim().toLowerCase();
    return this.accessStore.companies().filter(company =>
      !search || company.name.toLowerCase().includes(search));
  }

  showOptions(): void { this.open = true; }

  closeOptions(): void {
    setTimeout(() => this.open = false, 150);
  }

  selectCompany(company: AccessCompany | null): void {
    this.selectedCompanyId = company?.id ?? '';
    this.query = company?.name ?? '';
    this.open = false;
    this.companyChange.emit(this.selectedCompanyId);
  }

  clearIfEmpty(): void {
    if (!this.query.trim() && this.allowAll && this.selectedCompanyId) {
      this.selectCompany(null);
    }
  }
}
