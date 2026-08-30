import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessStore } from '../../../Core/services/access-store.service';

@Component({
  selector: 'app-company-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: './company-selector.html',
  styleUrl: './company-selector.css',
  host: { '[style.display]': 'canSwitchCompany ? "block" : "none"' }
})
export class CompanySelector implements OnInit {
  @Output() companyChange = new EventEmitter<string>();
  get companies() { return this.accessStore.companies(); }
  selectedCompanyId: string = '';
  canSwitchCompany = false;

  constructor(private readonly accessStore: AccessStore) { }

  ngOnInit(): void {
    const sync = () => {
      this.selectedCompanyId = this.accessStore.selectedCompanyId() ?? '';
      this.canSwitchCompany = this.accessStore.isSystemUser() && this.accessStore.companies().length > 0;
    };
    if (this.accessStore.access()) sync();
    else this.accessStore.initialize().subscribe({ next: sync });
  }

  onCompanyChange(): void {
    this.accessStore.initialize(this.selectedCompanyId).subscribe(() => {
      window.dispatchEvent(new CustomEvent('companyChanged', { detail: { companyId: this.selectedCompanyId } }));
      this.companyChange.emit(this.selectedCompanyId);
    });
  }
}
