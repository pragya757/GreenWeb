import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useToast } from '../hooks/useToast'

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  error:   <XCircle    className="w-5 h-5 text-red-500 flex-shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
  info:    <Info       className="w-5 h-5 text-blue-500 flex-shrink-0" />,
}

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-start gap-3 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 toast-enter"
          role="alert"
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm text-gray-700 flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
