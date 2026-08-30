import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  @Input() title = '';
  @Input() exportText = 'Export';
  @Input() addText = 'Add New';
  @Input() showSearch = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() showAdd = true;

  @Output() exportClick = new EventEmitter<void>();
  @Output() addClick = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  searchTerm = '';

  onSearchInput(): void {
    this.searchChange.emit(this.searchTerm);
  }
}
