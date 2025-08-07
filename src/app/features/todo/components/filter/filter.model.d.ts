export interface FilterModel {
  searchTerm: string;
  statuses: TaskStatus[];
  sort: 'asc' | 'desc';
}
