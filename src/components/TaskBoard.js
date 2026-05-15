'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, User2, Calendar } from 'lucide-react'

const COLUMNS = [
  { key: 'pending',     label: 'To Do',       color: 'bg-gray-400' },
  { key: 'in progress', label: 'In Progress',  color: 'bg-blue-500' },
  { key: 'done',        label: 'Done',         color: 'bg-emerald-500' },
]

export default function TaskBoard({ initialTasks, teamId, members }) {
  const [tasks, setTasks] = useState(initialTasks || [])
  const [loading, setLoading] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', assigned_to: '', due_date: '' })
  const supabase = createClient()

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    setLoading(true)

    const taskData = {
      team_id: teamId,
      title: newTask.title.trim(),
      status: 'pending',
      assigned_to: newTask.assigned_to || null,
      due_date: newTask.due_date || null,
    }

    const { data, error } = await supabase
      .from('workspace_tasks')
      .insert(taskData)
      .select('*, profiles(name)')
      .single()

    setLoading(false)
    if (!error && data) {
      setTasks(prev => [...prev, data])
      setNewTask({ title: '', assigned_to: '', due_date: '' })
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    await supabase.from('workspace_tasks').update({ status: newStatus }).eq('id', taskId)
  }

  const handleDelete = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    await supabase.from('workspace_tasks').delete().eq('id', taskId)
  }

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <div className="glass rounded-2xl p-5">
        <h3 className="section-title mb-4">Add Task</h3>
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Task Title *</label>
            <input
              required
              type="text"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              className="input-field bg-white/80"
              placeholder="What needs to be done?"
            />
          </div>
          <div className="w-full sm:w-44">
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Assignee</label>
            <select
              value={newTask.assigned_to}
              onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
              className="input-field bg-white/80"
            >
              <option value="">Unassigned</option>
              {members.map(m => (
                <option key={m.profile_id} value={m.profile_id}>{m.profiles?.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-44">
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Due Date</label>
            <input
              type="date"
              value={newTask.due_date}
              onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
              className="input-field bg-white/80"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary h-12 px-5 shrink-0 sm:self-end"
          >
            {loading ? <span className="spinner" /> : <Plus size={18} />}
            Add
          </button>
        </form>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div key={col.key} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-4 min-h-[350px]">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="font-bold text-gray-700 text-sm">{col.label}</span>
                </div>
                <span className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="text-center text-gray-300 text-sm py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    No tasks yet
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div key={task.id} className="glass-card p-4 group hover:ring-2 hover:ring-blue-300/40 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</p>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Assignee */}
                      {task.profiles?.name && (
                        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-500">
                          <User2 size={12} />
                          <span>{task.profiles.name}</span>
                        </div>
                      )}

                      {/* Due Date */}
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                          <Calendar size={12} />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Status Changer */}
                      <div className="mt-3 pt-2.5 border-t border-gray-100">
                        <select
                          value={task.status}
                          onChange={e => handleUpdateStatus(task.id, e.target.value)}
                          className="text-xs bg-transparent border-none text-blue-600 font-semibold cursor-pointer outline-none w-full focus:ring-0 p-0"
                        >
                          {COLUMNS.map(c => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
