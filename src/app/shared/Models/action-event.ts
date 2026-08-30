export interface ActionEvent {
      type: 'view' | 'edit' | 'delete';
  item: Record<string, unknown>;
}
