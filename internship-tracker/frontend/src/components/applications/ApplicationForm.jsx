import { useState } from 'react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, JOB_TYPES } from '../../utils/constants';

const EMPTY = {
  company: '', role: '', location: '', status: 'Applied', priority: 'Medium',
  jobType: 'Full-time', applicationDate: new Date().toISOString().split('T')[0],
  deadline: '', followUpDate: '', jobUrl: '', salary: '', notes: '',
  tags: '', coverLetterUsed: false, referral: false, resumeVersion: '',
};

export default function ApplicationForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial,
    applicationDate: initial.applicationDate ? new Date(initial.applicationDate).toISOString().split('T')[0] : EMPTY.applicationDate,
    deadline: initial.deadline ? new Date(initial.deadline).toISOString().split('T')[0] : '',
    followUpDate: initial.followUpDate ? new Date(initial.followUpDate).toISOString().split('T')[0] : '',
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      deadline: form.deadline || null,
      followUpDate: form.followUpDate || null,
    };
    onSubmit(payload);
  };

  const Field = ({ label, children, half }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="label">{label}</label>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Company *">
          <input className="input" value={form.company} onChange={set('company')} required placeholder="Google, Meta, etc." />
        </Field>
        <Field label="Role / Position *">
          <input className="input" value={form.role} onChange={set('role')} required placeholder="Software Engineer Intern" />
        </Field>
        <Field label="Location" half>
          <input className="input" value={form.location} onChange={set('location')} placeholder="San Francisco, CA / Remote" />
        </Field>
        <Field label="Status" half>
          <select className="input" value={form.status} onChange={set('status')}>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Priority" half>
          <select className="input" value={form.priority} onChange={set('priority')}>
            {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Job Type" half>
          <select className="input" value={form.jobType} onChange={set('jobType')}>
            {JOB_TYPES.map((j) => <option key={j}>{j}</option>)}
          </select>
        </Field>
        <Field label="Application Date" half>
          <input type="date" className="input" value={form.applicationDate} onChange={set('applicationDate')} />
        </Field>
        <Field label="Deadline" half>
          <input type="date" className="input" value={form.deadline} onChange={set('deadline')} />
        </Field>
        <Field label="Follow-up Date" half>
          <input type="date" className="input" value={form.followUpDate} onChange={set('followUpDate')} />
        </Field>
        <Field label="Salary / Stipend" half>
          <input className="input" value={form.salary} onChange={set('salary')} placeholder="$25/hr or $60,000" />
        </Field>
        <Field label="Job URL">
          <input type="url" className="input" value={form.jobUrl} onChange={set('jobUrl')} placeholder="https://..." />
        </Field>
        <Field label="Resume Version" half>
          <input className="input" value={form.resumeVersion} onChange={set('resumeVersion')} placeholder="v2, general, tailored" />
        </Field>
        <Field label="Tags (comma separated)" half>
          <input className="input" value={form.tags} onChange={set('tags')} placeholder="tech, FAANG, frontend" />
        </Field>
        <Field label="Notes">
          <textarea className="input min-h-[80px] resize-none" value={form.notes} onChange={set('notes')} placeholder="Interview notes, contact info, etc." rows={3} />
        </Field>
        <div className="col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.coverLetterUsed} onChange={set('coverLetterUsed')} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Cover Letter Used</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.referral} onChange={set('referral')} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Referral Applied</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary min-w-[120px]">
          {loading ? 'Saving...' : initial._id ? 'Update' : 'Add Application'}
        </button>
      </div>
    </form>
  );
}
