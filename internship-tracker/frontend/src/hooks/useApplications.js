import { useEffect } from 'react';
import { useAppStore } from '../context/appStore';

/**
 * Hook that fetches applications whenever filters change.
 * Returns applications, loading state, and store actions.
 */
export function useApplications() {
  const {
    applications,
    loading,
    error,
    filters,
    selectedIds,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    bulkDelete,
    setFilters,
    toggleSelected,
    clearSelected,
  } = useAppStore();

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  return {
    applications,
    loading,
    error,
    filters,
    selectedIds,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    bulkDelete,
    setFilters,
    toggleSelected,
    clearSelected,
  };
}
