import { FilterModel } from '../components/filter/filter.model';

export const DefaultFilter: FilterModel = {
  searchTerm: '',
  sort: 'asc',
  statuses: ['Todo', 'In Progress', 'Completed']
};
