"use client"
import React from "react"

interface LoadingOverlayProps {
  open: boolean
  title?: string
  hint?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, title = "Preparing your book…", hint }) => {
  if (!open) return null
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper bg-white shadow-soft-lg">
        <div className="loading-shadow">
          <div className="loading-animation">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--accent-warm)]">
              <path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4.93 4.93l2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.24 16.24l2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4.93 19.07l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="loading-title text-center">{title}</div>
          {hint ? (
            <div className="text-sm text-[var(--text-secondary)]">{hint}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
