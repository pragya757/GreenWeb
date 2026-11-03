import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Globe, ArrowRight, AlertCircle, Info } from 'lucide-react'
import { analyzeWebsite } from '../services/api'
import { useToast } from '../hooks/useToast'

export default function AnalyzerPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()

  // Pre-fill URL if navigated from landing page
  useEffect(() => {
    if (location.state?.url) setUrl(location.state.url)
  }, [location.state])

  const validateUrl = (value) => {
    if (!value.trim()) return 'Please enter a URL.'
    try {
      const u = value.startsWith('http') ? value : `https://${value}`
      new URL(u)
      return ''
    } catch {
      return 'Please enter a valid URL (e.g. https://example.com).'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateUrl(url)
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    try {
      const response = await analyzeWebsite(url.trim())
      const data = response.data

      if (!data || typeof data !== 'object' || !data.id) {
        throw new Error('The server returned an unexpected response. Please try again.')
      }

      addToast('Analysis complete!', 'success')
      navigate(`/results/${data.id}`, { state: { result: data } })
    } catch (ex) {
      const msg = ex.response?.data?.error || ex.message || 'Analysis failed. Please try again.'
      setError(msg)
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg mb-6">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Website Carbon Analyzer</h1>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Enter any public website URL to estimate its carbon footprint and get
          personalised green optimisation recommendations.
        </p>
      </div>

      {/* Form */}
      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); if (error) setError('') }}
                placeholder="https://example.com"
                className={`input-field pl-12 py-4 text-base ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={loading}
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            id="analyze-btn"
            disabled={loading}
            className={`btn-primary w-full justify-center py-4 text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner w-5 h-5 border-2" />
                Analysing website…
              </>
            ) : (
              <>
                Analyse Website
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Methodology note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 leading-relaxed">
          <strong>How we analyse: </strong>
          Our Flask backend safely fetches the HTML document and parses visible resource
          references. We then apply a heuristic carbon model. Results are clearly
          labelled as directly measured, counted from HTML, or estimated.
          This tool does <em>not</em> simulate a full browser load — sub-resource sizes
          are approximated using configurable averages.
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm mx-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
              <Globe className="absolute inset-0 m-auto w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-1">Analysing Website</h3>
              <p className="text-sm text-gray-500">Fetching page, counting resources,<br />estimating carbon footprint…</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
