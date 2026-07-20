'use client'

import React, { createContext, useContext, useState } from 'react'

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm'

interface ModalOptions {
  title?: string
  message: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
}

interface AdminModalContextType {
  showAlert: (message: string, type?: ModalType, title?: string) => void
  showConfirm: (message: string, onConfirm: () => void | Promise<void>, title?: string) => void
  closeModal: () => void
}

const AdminModalContext = createContext<AdminModalContextType | undefined>(undefined)

export function AdminModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<ModalOptions | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const showAlert = (message: string, type: ModalType = 'info', title?: string) => {
    let defaultTitle = 'Notification'
    if (type === 'success') defaultTitle = 'Success'
    if (type === 'error') defaultTitle = 'Error'
    if (type === 'warning') defaultTitle = 'Warning'

    setModalState({
      title: title || defaultTitle,
      message,
      type,
      confirmText: 'OK'
    })
    setIsOpen(true)
  }

  const showConfirm = (message: string, onConfirm: () => void | Promise<void>, title = 'Confirm Action') => {
    setModalState({
      title,
      message,
      type: 'confirm',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm
    })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalState(null)
    setLoading(false)
  }

  const handleConfirm = async () => {
    if (modalState?.onConfirm) {
      setLoading(true)
      try {
        await modalState.onConfirm()
      } finally {
        setLoading(false)
        closeModal()
      }
    } else {
      closeModal()
    }
  }

  return (
    <AdminModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}
      {isOpen && modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-sm animate-[admin-fade-in_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-[admin-scale-in_0.2s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Header */}
            <div className="p-6 pb-4 flex items-start gap-4">
              {modalState.type === 'success' && (
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              {modalState.type === 'error' && (
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
              )}
              {(modalState.type === 'warning' || modalState.type === 'confirm') && (
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
              )}
              {modalState.type === 'info' && (
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-bold text-slate-900 m-0 leading-tight">
                  {modalState.title}
                </h3>
                <p className="text-[13.5px] text-slate-600 mt-2 leading-relaxed font-sans m-0">
                  {modalState.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              {modalState.cancelText && (
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-all border border-slate-200 cursor-pointer bg-white"
                >
                  {modalState.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-5 py-2 text-[13px] font-bold text-white rounded-xl shadow-md transition-all cursor-pointer border-none ${
                  modalState.type === 'confirm' || modalState.type === 'warning'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : modalState.type === 'error'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#1e1b4b] hover:bg-[#2e1f5e] shadow-indigo-900/20'
                }`}
              >
                {loading ? 'Processing...' : modalState.confirmText || 'OK'}
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminModalContext.Provider>
  )
}

export function useAdminModal() {
  const context = useContext(AdminModalContext)
  if (!context) {
    throw new Error('useAdminModal must be used within an AdminModalProvider')
  }
  return context
}
