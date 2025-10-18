// components/filters/config/clearFilters.js
import { FILTER_CATEGORIES } from './filterConfig';

export function clearNonLocationFilters(currentParams) {
  const params = new URLSearchParams(currentParams);

  // Remove all property filters
  FILTER_CATEGORIES.property.forEach(key => params.delete(key));

  // Reset pagination/sorting
  params.set('page', '1');
  params.set('sortBy', 'listedAt');
  params.set('sortOrder', 'desc');

  return params;
}
