import { Pencil, Trash2, CheckCircle, Clock } from 'lucide-react'

const priorityConfig = {
  LOW: { label: 'Low', className: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Medium', className: 'bg-blue-50 text-blue-700' },
  HIGH: { label: 'High', className: 'bg-red-50 text-red-700' },
}

const statusConfig = {
  TODO: { label: 'To Do', className: 'bg-slate-100 text-slate-600' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-amber-50 text-amber-700' },
  DONE: { label: 'Done', className: 'bg-green-50 text-green-700' },
}

const categoryConfig = {
  STUDIES: { label: 'Studies', className: 'bg-violet-50 text-violet-700' },
  WORK: { label: 'Work', className: 'bg-blue-50 text-blue-700' },
  PERSONAL: { label: 'Personal', className: 'bg-teal-50 text-teal-700' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TaskCard({ task, onEdit, onDelete, onComplete, onInProgress }) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.MEDIUM
  const status = statusConfig[task.status] ?? statusConfig.TODO
  const category = categoryConfig[task.category] ?? categoryConfig.WORK

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group flex flex-col">
      {/* Title + Status */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-800 leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.className}`}>
          {priority.label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${category.className}`}>
          {task.categoryDisplayName || category.label}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">{formatDate(task.createdAt)}</span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== 'DONE' && (
            <button
              onClick={() => onComplete(task.id)}
              title="Mark complete"
              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
            >
              <CheckCircle size={15} />
            </button>
          )}
          {task.status === 'TODO' && (
            <button
              onClick={() => onInProgress(task.id)}
              title="Start task"
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Clock size={15} />
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
