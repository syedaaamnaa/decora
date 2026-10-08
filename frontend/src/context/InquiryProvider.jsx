import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const InquiryContext = createContext(null)

/**
 * Global project-inquiry popup state.
 * Open it from anywhere:  const { openInquiry } = useInquiry(); openInquiry('Interior Design')
 */
export function InquiryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [presetService, setPresetService] = useState('')

  const openInquiry = useCallback((service = '') => {
    setPresetService(service)
    setIsOpen(true)
  }, [])

  const closeInquiry = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, presetService, openInquiry, closeInquiry }),
    [isOpen, presetService, openInquiry, closeInquiry],
  )

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

export function useInquiry() {
  const ctx = useContext(InquiryContext)
  if (!ctx) throw new Error('useInquiry must be used within InquiryProvider')
  return ctx
}
