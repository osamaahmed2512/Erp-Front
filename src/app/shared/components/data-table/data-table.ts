import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, TemplateRef } from '@angular/core';
import { TableColumn } from '../../Models/table-column.interface';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, Ellipsis, ListFilter, LucideAngularModule, Search, Trash2 } from 'lucide-angular/src/icons';

import { ChevronsRight, Eye, Pencil } from 'lucide-angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-data-table',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {

  searchTearm = '';
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() totalItems: number = 20;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() hasPreviousPage = false;
  @Input() loading = false;
  @Input() hasNextPage = false;
  @Input() showView = true;
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() allowBadgeClick = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() filterClick = new EventEmitter<void>();
  @Output() viewClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<string>();
  @Output() deleteClick = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() bageClick = new EventEmitter<string>();
  icons = {
    ListFilter, Search, ArrowUpDown, Trash2, Pencil, Eye,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis
  };
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }
  get rangeLabel(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}–${end} of ${this.totalItems}`;
  }
  get visiblePages(): number[] {
    const delta = 2;
    const start = Math.max(1, this.currentPage - delta);
    const end = Math.min(this.totalPages, this.currentPage + delta);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['pageSize']) {
      // Optional: handle internal updates
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }

  onPageSizeChange(): void {
    this.pageSizeChange.emit(this.pageSize);
  }

  onFilter(): void { this.filterClick.emit(); }
  onSearch(): void {
    this.searchChange.emit(this.searchTearm);
  }
  get visibleColumns(): TableColumn[] {
  return this.columns.filter(c => !c.hidden);
}

}
