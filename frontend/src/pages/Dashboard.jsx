import { useState, useEffect, useCallback } from 'react'
import { Plus, ListTodo, Clock, CheckCircle, BarChart2, AlertCircle, Activity } from 'lucide-react'
import { AITipCard } from '../components/AI/AITipCard'
import * as tasksApi from '../api/tasks'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import StatsCard from '../components/StatsCard'
import FilterBar from '../components/FilterBar'

const EMPTY_FILTERS = { status: '', category: '', priority: '' }

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [tasksData, statsData] = await Promise.all([
        tasksApi.getTasks(filters),
        tasksApi.getTaskStats(),
      ])
      setTasks(tasksData)
      setStats(statsData)
    } catch {
      setError('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSave(form) {
    if (editingTask) {
      await tasksApi.updateTask(editingTask.id, form)
    } else {
      await tasksApi.createTask(form)
    }
    await fetchData()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try {
      await tasksApi.deleteTask(id)
      await fetchData()
    } catch {
      setError('Failed to delete task.')
    }
  }

  async function handleComplete(id) {
    try {
      await tasksApi.markComplete(id)
      await fetchData()
    } catch {
      setError('Failed to update task.')
    }
  }

  async function handleInProgress(id) {
    try {
      await tasksApi.markInProgress(id)
      await fetchData()
    } catch {
      setError('Failed to update task.')
    }
  }

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTask(null)
  }

  const statsCards = stats
    ? [
        {
          label: 'Total',
          value: stats.total,
          icon: BarChart2,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
        },
        {
          label: 'To Do',
          value: stats.todo,
          icon: ListTodo,
          color: 'text-slate-500',
          bg: 'bg-slate-100',
        },
        {
          label: 'In Progress',
          value: stats.inProgress,
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
        },
        {
          label: 'Done',
          value: stats.done,
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
        },
        {
          label: 'Completion',
          value: `${Math.round(stats.completionRate ?? 0)}%`,
          icon: Activity,
          color: 'text-violet-600',
          bg: 'bg-violet-50',
        },
      ]
    : []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your work</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>
      <div className="mb-6">
          <AITipCard stats={stats} tasks={tasks} />
      </div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {statsCards.map((card) => (
            <StatsCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Task grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <ListTodo size={26} className="text-slate-400" />
          </div>
          <p className="font-medium text-slate-600">No tasks found</p>
          <p className="text-sm text-slate-400 mt-1">Create your first task to get started</p>
          <button
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus size={15} />
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
              onInProgress={handleInProgress}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && <TaskModal task={editingTask} onSave={handleSave} onClose={closeModal} />}
    </div>
  )
}
