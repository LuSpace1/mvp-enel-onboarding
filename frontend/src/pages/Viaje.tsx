import { useEffect, useRef, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Nav } from '@/components/Nav'
import { PasoHeader, PasoPantalla } from '@/components/PasoPantalla'
import { PortadaDelViaje } from '@/components/PortadaDelViaje'
import { useAuthStore } from '@/store/useAuthStore'
import { useVideosStore } from '@/store/useVideosStore'
import { useViajeStore } from '@/store/useViajeStore'
import { PASO_INICIAL, PASOS_VIAJE } from '@/lib/data/viaje'
import { CierreSection, Footer } from '@/sections/CierreSection'
import { CulturaSection } from '@/sections/CulturaSection'
import { GaleriasSection } from '@/sections/GaleriasSection'
import { HistoriaSection } from '@/sections/HistoriaSection'
import { MapaConcesionSection } from '@/sections/MapaConcesionSection'
import { OrganigramaSection } from '@/sections/OrganigramaSection'
import { PoliticasISOSection } from '@/sections/PoliticasISOSection'
import { CadenaValorSection } from '@/sections/CadenaValorSection'

function contenidoDelPaso(id: string): ReactNode {
  switch (id) {
    case 'historia':
      return <HistoriaSection />
    case 'cultura':
      return <CulturaSection />
    case 'organigrama':
      return <OrganigramaSection />
    case 'mapa':
      return <MapaConcesionSection />
    case 'cadena':
      return <CadenaValorSection />
    case 'politicas':
      return <PoliticasISOSection />
    case 'galerias':
      return <GaleriasSection />
    case 'cierre':
      return (
        <>
          <CierreSection />
          <Footer />
        </>
      )
    default:
      return null
  }
}

export function Viaje() {
  const reduce = useReducedMotion()
  const pasoActual = useViajeStore((estado) => estado.pasoActual)
  const initAnonymous = useAuthStore((estado) => estado.initAnonymous)
  const cargarVideos = useVideosStore((estado) => estado.cargar)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    void initAnonymous()
    void cargarVideos()
  }, [initAnonymous, cargarVideos])

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [pasoActual])

  const paso = PASOS_VIAJE.find((item) => item.id === pasoActual)

  return (
    <div className="text-enel-navy min-h-svh bg-[#f0eee6] font-sans">
      <Nav />
      <main ref={mainRef} className="h-dvh overflow-y-auto pt-16">
        {pasoActual !== PASO_INICIAL && paso && <PasoHeader paso={paso} />}
        <AnimatePresence mode="wait">
          <motion.div
            key={pasoActual}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {pasoActual === PASO_INICIAL ? (
              <PortadaDelViaje />
            ) : paso ? (
              <PasoPantalla paso={paso}>{contenidoDelPaso(paso.id)}</PasoPantalla>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
