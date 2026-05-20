import { create } from 'zustand';
import api from '../utils/api';

export const useAppStore = create((set, get) => ({
  applications: [],
  stats: null,
  loading: false,
  statsLoading: false,
  error: null,
  filters: { status: 'All', priority: 'All', search: '' },
  selectedIds: [],

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    })),
  clearSelected: () => set({ selectedIds: [] }),

  fetchApplications: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'All') params.set('status', filters.status);
      if (filters.priority !== 'All') params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/applications?${params}`);
      set({ applications: data.applications, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', loading: false });
    }
  },

  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      const { data } = await api.get('/applications/stats');
      set({ stats: data.stats, statsLoading: false });
    } catch {
      set({ statsLoading: false });
    }
  },

  createApplication: async (formData) => {
    try {
      const { data } = await api.post('/applications', formData);
      set((state) => ({ applications: [data.application, ...state.applications] }));
      get().fetchStats();
      return { success: true, application: data.application };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create' };
    }
  },

  updateApplication: async (id, formData) => {
    try {
      const { data } = await api.put(`/applications/${id}`, formData);
      set((state) => ({
        applications: state.applications.map((a) => (a._id === id ? data.application : a)),
      }));
      get().fetchStats();
      return { success: true, application: data.application };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update' };
    }
  },

  deleteApplication: async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      set((state) => ({ applications: state.applications.filter((a) => a._id !== id) }));
      get().fetchStats();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  },

  bulkDelete: async () => {
    const { selectedIds } = get();
    if (!selectedIds.length) return;
    try {
      await api.delete('/applications/bulk', { data: { ids: selectedIds } });
      set((state) => ({
        applications: state.applications.filter((a) => !selectedIds.includes(a._id)),
        selectedIds: [],
      }));
      get().fetchStats();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },
}));
