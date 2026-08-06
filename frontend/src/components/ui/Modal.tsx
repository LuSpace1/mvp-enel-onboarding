import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

import { track } from '@/lib/analytics'

interface ModalProps {
  abierto: boolean
  onCerrar: () => void
  children: React.ReactNode
  analiticaId?: string
}

export function Modal({ abierto, onCerrar, children, analiticaId }: ModalProps) {
  useEffect(() => {
    if (!abierto) return
    const onKey = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  useEffect(() => {
    if (abierto && analiticaId) {
      track('modal.abierto', { id: analiticaId })
    }
  }, [abierto, analiticaId])

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="bg-enel-navy/60 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCerrar}
        >
          <motion.div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(evento) => evento.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
