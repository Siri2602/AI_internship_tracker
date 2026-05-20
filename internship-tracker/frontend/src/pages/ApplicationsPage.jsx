import { useEffect, useState } from 'react';
import {
  PlusIcon, MagnifyingGlassIcon, FunnelIcon, TrashIcon,
  BriefcaseIcon, Squares2X2Icon, ListBulletIcon, TableCellsIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAppStore } from '../context/appStore';
import { useDebounce } from '../hooks/useDebounce';
import ApplicationCard from '../components/applications/ApplicationCard';
import ApplicationTable from '../components/applications/ApplicationTable';
import KanbanBoard from '../components/applications/KanbanBoard';
import ApplicationForm from '../components/applications/ApplicationForm';
import { Modal, LoadingSpinner, EmptyState } from '../components/ui';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';
import clsx from 'clsx';

const VIEWS = [
  { key: 'grid', icon: Squares2X2Icon, label: 'Grid' },
  { key: 'table', icon: TableCellsIcon, label: 'Table' },
  { key: 'kanban', icon: ListBulletIcon, label: 'Kanban' },
];

export default function ApplicationsPage() {
  const {
    applications, loading, filters, selectedIds,
    fetchApplications, createApplication, updateApplication, deleteApplication,
    bulkDelete, setFilters, toggleSelected, clearSelected,
  } = useAppStore();

  const [showForm, setShowForm] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState(() => localStorage.getItem('appView') || 'grid');
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 350);

  // Sync debounced search to store filter
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const changeView = (v) => {
    setView(v);
    localStorage.setItem('appView', v);
  };

  const handleCreate = async (data) => {
    setFormLoading(true);
    const result = await createApplication(data);
    setFormLoading(false);
    if (result.success) {
      toast.success('Application added!');
      setShowForm(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    const result = await updateApplication(editApp._id, data);
    setFormLoading(false);
    if (result.success) {
      toast.success('Application updated!');
      setEditApp(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteApplication(id);
    if (result.success) toast.success('Deleted successfully');
    else toast.error(result.message);
    setDeleteConfirm(null);
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.length;
    const result = await bulkDelete();
    if (result.success) toast.success(`Deleted ${count} application${count > 1 ? 's' : ''}`);
    else toast.error('Bulk delete failed');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
            {filters.status !== 'All' ? ` · ${filters.status}` : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Filters + View switcher */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search company, role, location…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Status & Priority filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            className="input w-auto text-sm py-2"
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            className="input w-auto text-sm py-2"
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value })}
          >
            <option value="All">All Priorities</option>
            {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl ml-auto">
          {VIEWS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => changeView(key)}
              title={label}
              className={clsx(
                'p-1.5 rounded-lg transition-all',
                view === key
                  ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedIds.length} selected
            </span>
            <button onClick={handleBulkDelete} className="btn-danger py-1.5 px-3 text-xs">
              <TrashIcon className="w-3.5 h-3.5" /> Delete
            </button>
            <button onClick={clearSelected} className="btn-ghost py-1.5 px-3 text-xs">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={BriefcaseIcon}
          title="No applications found"
          description={
            filters.search || filters.status !== 'All' || filters.priority !== 'All'
              ? 'Try adjusting your filters or search query.'
              : 'Start tracking your internship applications to stay organized and land your dream role.'
          }
          action={
            !filters.search && filters.status === 'All' && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <PlusIcon className="w-4 h-4" /> Add Your First Application
              </button>
            )
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              selected={selectedIds.includes(app._id)}
              onSelect={toggleSelected}
              onEdit={(a) => setEditApp(a)}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      ) : view === 'table' ? (
        <ApplicationTable
          applications={applications}
          selectedIds={selectedIds}
          onSelect={toggleSelected}
          onEdit={(a) => setEditApp(a)}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      ) : (
        <KanbanBoard
          applications={applications}
          onEdit={(a) => setEditApp(a)}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      )}

      {/* Create modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add New Application" size="lg">
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editApp} onClose={() => setEditApp(null)} title="Edit Application" size="lg">
        {editApp && (
          <ApplicationForm
            initial={editApp}
            onSubmit={handleUpdate}
            onCancel={() => setEditApp(null)}
            loading={formLoading}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Application" size="sm">
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Are you sure you want to delete this application? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
