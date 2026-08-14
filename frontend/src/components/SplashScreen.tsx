import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Lightbulb } from '@phosphor-icons/react'

export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [bulbLit, setBulbLit] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    // Si el usuario tiene animaciones desactivadas, nos saltamos el intro inmediatamente
    if (reduce) {
      setIsVisible(false)
      onComplete?.()
      return
    }

    // Paso 1: La chispa llega a la bombilla a los 1.3 segundos
    const timerBulb = setTimeout(() => {
      setBulbLit(true)
    }, 1300)

    // Paso 2: Toda la pantalla se desliza hacia arriba a los 3.2 segundos revelando la web
    const timerEnd = setTimeout(() => {
      setIsVisible(false)
    }, 3200)

    return () => {
      clearTimeout(timerBulb)
      clearTimeout(timerEnd)
    }
  }, [reduce, onComplete])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-enel-navy overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 1 }} // Al salir, se levanta como un telón
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Destello explosivo cuando se enciende */}
          <AnimatePresence>
            {bulbLit && (
              <motion.div
                className="absolute m-auto h-64 w-64 rounded-full bg-white blur-3xl mix-blend-screen"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          <div className="relative flex h-full w-full max-w-sm flex-col items-center justify-center">
            
            {/* SVG del cable que baja desde arriba */}
            <div className="absolute top-0 bottom-[50%] flex w-[120px] justify-center overflow-visible">
              <svg
                viewBox="0 0 100 400"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Cable de fondo (apagado) */}
                <path
                  d="M 50 0 C 50 150, 10 250, 50 400"
                  fill="transparent"
                  stroke="#1a253a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                
                {/* Cable rojo (Dibujándose) */}
                <motion.path
                  d="M 50 0 C 50 150, 10 250, 50 400"
                  fill="transparent"
                  stroke="#eb0053"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
                />

                {/* Chispa Luminosa (Viajando por el cable) */}
                <motion.path
                  d="M 50 0 C 50 150, 10 250, 50 400"
                  fill="transparent"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0.05, pathOffset: 0, opacity: 1 }}
                  animate={{ pathOffset: 1, opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
                  style={{ filter: 'drop-shadow(0 0 10px #ffffff)' }}
                />
              </svg>
            </div>

            {/* Bombilla */}
            <motion.div
              className="relative z-10 -mt-2 transition-all duration-300"
              style={{
                color: bulbLit ? '#ffe600' : '#1a253a',
                filter: bulbLit ? 'drop-shadow(0px 0px 40px rgba(255, 230, 0, 0.9))' : 'none',
              }}
            >
              <Lightbulb size={90} weight={bulbLit ? 'fill' : 'regular'} />
            </motion.div>

            {/* Texto y Título */}
            <motion.div
              className="absolute top-[60%] flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={bulbLit ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-white">
                Enel <span className="text-enel-red">Distribución</span>
              </h1>
              <motion.div 
                className="mt-4 h-1 w-12 rounded-full bg-enel-pink"
                initial={{ scaleX: 0 }}
                animate={bulbLit ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
