"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)

    // Log to monitoring service
    if (typeof window !== "undefined") {
      // Send to analytics/monitoring
      console.error("Component Error:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center p-8 glass-pink rounded-2xl max-w-md">
              <div className="text-6xl mb-4">😵</div>
              <h2 className="text-2xl font-bold text-white mb-4">Oops! Có lỗi xảy ra</h2>
              <p className="text-gray-300 mb-6">Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.</p>
              <button
                onClick={() => window.location.reload()}
                className="glass-button px-6 py-3 rounded-lg font-semibold"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
