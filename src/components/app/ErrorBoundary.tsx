"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import type { Dictionary } from "@/i18n/dictionaries"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  copy: Dictionary["errors"]
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

    // Gửi lỗi đến hệ thống giám sát khi chạy trên trình duyệt.
    if (typeof window !== "undefined") {
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
              <h2 className="text-2xl font-bold text-white mb-4">{this.props.copy.boundaryTitle}</h2>
              <p className="text-gray-300 mb-6">{this.props.copy.boundaryDescription}</p>
              <button
                onClick={() => window.location.reload()}
                className="glass-button px-6 py-3 rounded-lg font-semibold"
              >
                {this.props.copy.reload}
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
