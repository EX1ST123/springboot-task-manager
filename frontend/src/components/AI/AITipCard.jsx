import { useState, useEffect, useCallback } from 'react'
import { Sparkles, RefreshCw, X } from 'lucide-react'
import { useFeatures } from '../../context/FeatureContext'

function LoadingDots({ color = 'bg-blue-400', size = 'w-1.5 h-1.5' }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${size} rounded-full ${color} animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export function AITipCard({ stats, tasks, onDismiss }) {
  const { aiEnabled } = useFeatures()
  const [tip, setTip] = useState('')
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [error, setError] = useState(false)

  const fetchTip = useCallback(async () => {
    setLoading(true)
    setError(false)
    setTip('')

    try {
      const response = await fetch('/api/ai/tip', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          stats: stats ? {
            total: stats.total,
            todo: stats.todo,
            inProgress: stats.inProgress,
            done: stats.done,
            completionRate: stats.completionRate
          } : null,
          tasks: tasks?.slice(0, 5).map(t => ({ 
            title: t.title, 
            priority: t.priority, 
            status: t.status 
          }))
        }),
      })
      
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data = await response.json()
      setTip(data.tip)
    } catch (err) {
      console.error('Failed to fetch tip:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [stats, tasks])

  useEffect(() => {
    if (aiEnabled && !dismissed) {
      fetchTip()
    }
  }, [aiEnabled, fetchTip, dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const handleRefresh = () => {
    fetchTip()
  }

  if (!aiEnabled || dismissed) return null

  return (
    <div className="relative flex items-start gap-3 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-xl px-4 py-3.5 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={14} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
          AI Productivity Tip
        </p>

        {loading && (
          <div className="flex items-center gap-2">
            <LoadingDots />
            <span className="text-xs text-slate-400">Generating tip…</span>
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-slate-500">
            Couldn't load a tip right now.{' '}
            <button
              onClick={handleRefresh}
              className="text-blue-600 hover:underline font-medium"
            >
              Try again
            </button>
          </p>
        )}

        {!loading && !error && tip && (
          <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!loading && (
          <button
            onClick={handleRefresh}
            title="New tip"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        )}
        <button
          onClick={handleDismiss}
          title="Dismiss"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}