import { AlertTriangle, Leaf, TrendingDown } from 'lucide-react'

const PRIORITY_CLASS = {
  High:   'priority-high',
  Medium: 'priority-medium',
  Low:    'priority-low',
}

const PRIORITY_ICON = {
  High:   '🔴',
  Medium: '🟡',
  Low:    '🟢',
}

export default function RecommendationCard({ rec }) {
  return (
    <div className="card hover:border-emerald-200 border transition-all animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-bold text-gray-900 text-sm leading-snug">{rec.title}</h4>
        <span className={`${PRIORITY_CLASS[rec.priority] || 'priority-medium'} whitespace-nowrap text-xs`}>
          {PRIORITY_ICON[rec.priority]} {rec.priority}
        </span>
      </div>

      <p className="text-gray-600 text-xs leading-relaxed mb-3">{rec.explanation}</p>

      <div className="flex items-start gap-2 bg-emerald-50 rounded-lg p-3">
        <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-emerald-800 text-xs leading-relaxed">{rec.sustainability_impact}</p>
      </div>
    </div>
  )
}
