export interface TableColumn {
  key: string;
  label: string;
  hidden?:boolean; 
  sortable?: boolean;
  class?: string;           // ← Add this line
  width?: string;
  badge?: boolean;
  badgeClass?: (value: any) => string;
  clickable?: boolean;
}