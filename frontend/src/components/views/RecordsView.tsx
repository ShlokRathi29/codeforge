import React, { useState } from 'react'
import { Search, Plus, ExternalLink, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { mockRecords } from '../../api/client'
import { formatDate } from '../../lib/utils'
import type { ActivityRecord } from '../../types'

interface RecordsViewProps {
  onAddNew: () => void
}

export const RecordsView: React.FC<RecordsViewProps> = ({ onAddNew }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [records, setRecords] = useState<ActivityRecord[]>(mockRecords)
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(null)

  const categories = ['All', 'AI / ML', 'Database', 'Search Engine', 'Auth & Security']

  const filteredRecords = records.filter((rec) => {
    const matchesCategory = filterCategory === 'All' || rec.category === filterCategory
    const matchesSearch =
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.author.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
    if (selectedRecord?.id === id) setSelectedRecord(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Data & Records Hub</h2>
          <p className="text-xs text-slate-400 mt-1">
            Central repository for pipelines, generated outputs, and batch jobs
          </p>
        </div>
        <Button onClick={onAddNew} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          New Pipeline Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter records..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedRecord ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No records match the active criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition cursor-pointer"
                      onClick={() => setSelectedRecord(item)}
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-100">{item.title}</td>
                      <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            item.status === 'completed'
                              ? 'success'
                              : item.status === 'in_progress'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{formatDate(item.createdAt)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="inline-flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="p-1 text-slate-400 hover:text-indigo-400 rounded transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Record Detail Drawer */}
        {selectedRecord && (
          <div className="lg:col-span-1">
            <Card className="h-full border-indigo-500/30">
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </CardHeader>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Identifier</span>
                  <span className="font-mono text-slate-300">{selectedRecord.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Operation</span>
                  <span className="text-slate-100 font-semibold">{selectedRecord.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Category</span>
                  <span className="text-slate-300">{selectedRecord.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Initiated By</span>
                  <span className="text-slate-300">{selectedRecord.author}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Created At</span>
                  <span className="text-slate-300">{formatDate(selectedRecord.createdAt)}</span>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-500 block mb-1">Execution Payload</span>
                  <pre className="bg-slate-950 p-2.5 rounded-lg text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
{JSON.stringify(
  {
    status: selectedRecord.status,
    retries: 0,
    metrics: { cpu_time: '12ms', memory_mb: 48 },
  },
  null,
  2
)}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
