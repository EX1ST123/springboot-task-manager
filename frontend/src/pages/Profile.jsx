import { useState, useEffect } from 'react'
import { Save, User, Target, Zap, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import * as usersApi from '../api/users'
import { useAuth } from '../context/AuthContext'
import { useFeatures } from '../context/FeatureContext'

export default function Profile() {
  const { updateUser } = useAuth()
  const { aiEnabled, toggleAI } = useFeatures() // Use unified context
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ mainGoal: '', workRhythm: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    usersApi
      .getProfile()
      .then((data) => {
        setProfile(data)
        setForm({
          mainGoal: data.mainGoal ?? '',
          workRhythm: data.workRhythm ?? '',
        })
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
    setError('')
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const updated = await usersApi.updateProfile(form)
      setProfile(updated)
      updateUser(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3500)
    } catch {
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Handle AI toggle
  async function handleAIToggle() {
    toggleAI()
    // Optionally sync with backend
    try {
      await usersApi.updateProfile({ iaEnabled: !aiEnabled })
    } catch (err) {
      console.error('Failed to sync AI preference with server')
    }
  }

  const inputCls =
    'w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors'

  const labelCls = 'block text-xs font-medium uppercase tracking-widest text-slate-500 mb-1.5'

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="h-7 w-48 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Account card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-4">
            Account
          </h2>
          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={profile?.email ?? ''}
                readOnly
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Preferences card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Main Goal</label>
              <div className="relative">
                <Target
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={form.mainGoal}
                  onChange={(e) => set('mainGoal', e.target.value)}
                  placeholder="e.g. Complete my thesis"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Work Rhythm</label>
              <div className="relative">
                <Zap
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={form.workRhythm}
                  onChange={(e) => set('workRhythm', e.target.value)}
                  placeholder="e.g. Morning person, 2h deep work blocks"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistance card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">AI Assistance</p>
                <p className="text-xs text-slate-400 mt-0.5">Enable smart suggestions and insights</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={aiEnabled}
              onClick={handleAIToggle}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30',
                aiEnabled ? 'bg-blue-600' : 'bg-slate-200',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                  aiEnabled ? 'translate-x-6' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-600">
            <CheckCircle size={15} className="shrink-0" />
            Profile saved successfully
          </div>
        )}

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}