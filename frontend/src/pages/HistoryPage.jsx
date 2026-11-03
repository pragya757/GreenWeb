import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  History, Search, Trash2, Eye, Globe, AlertTriangle,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { getHistory, deleteAnalysis } from '../services/api'
import { useToast } from '../hooks/useToast'

const BADGE = {
  Excellent:          'badge-excellent',
  Good:               'badge-good',
  'Needs Improvement':'badge-needs-imp',
  Poor:               'badge-poor',
}

export default function HistoryPage() {
  const [data, setData]         = useState({ items: [], total: 0, page: 1, per_page: 20 })
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const fetchHistory = useCallback(() => {
    setLoading(true)
    getHistory({ search, page, per_page: 15 })
      .then(r => setData(r.data))
      .catch(() => addToast('Failed to load history.', 'error'))
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleDelete = async (id) => {
    try {
      await deleteAnalysis(id)
      addToast('Analysis deleted.', 'success')
      fetchHistory()
    } catch {
      addToast('Failed to delete analysis.', 'error')
    }
    setDeleteId(null)
  }

  const totalPages = Math.ceil(data.total / (data.per_page || 15))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <History className="w-7 h-7 text-emerald-600" />
            Analysis History
          </h1>
          <p className="text-gray-500 text-sm mt-1">{data.total} analyses stored</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by URL…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Confirm delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-slide-up">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Analysis?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-primary bg-red-600 hover:bg-red-700 flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="spinner w-10 h-10" />
        </div>
      )}

      {/* Empty state */}
      {!loading && data.items.length === 0 && (
        <div className="card text-center py-20">
          <History className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 text-lg mb-2">
            {search ? 'No results found' : 'No Analyses Yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {search ? `No analyses match "${search}"` : 'Start by analysing your first website.'}
          </p>
          {!search && (
            <button onClick={() => navigate('/analyze')} className="btn-primary mx-auto">
              Analyse a Website
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && data.items.length > 0 && (
        <>
          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    <th className="px-6 py-4">Website URL</th>
                    <th className="px-6 py-4">Carbon (Est.)</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((a, i) => (
                    <tr key={a.id} className={`border-b border-gray-50 hover:bg-emerald-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-800 max-w-[250px] truncate block">
                            {a.website_url.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{(a.carbon_emissions || 0).toFixed(4)}g</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">{Math.round(a.environmental_score)}/100</td>
                      <td className="px-6 py-4">
                        <span className={BADGE[a.performance_category] || 'badge-needs-imp'}>
                          {a.performance_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(a.analyzed_at).toLocaleDateString()}<br />
                        <span className="text-gray-300">{new Date(a.analyzed_at).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/results/${a.id}`)}
                            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="View report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(a.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
