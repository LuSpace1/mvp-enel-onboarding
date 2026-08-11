import { useEffect, useRef, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Nav } from '@/components/Nav'
import { PasoHeader } from '@/components/PasoPantalla'
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

// Se eliminó contenidoDelPaso ya que renderizaremos todo el contenido de forma continua.

function SectionObserver({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const navegar = useViajeStore((estado) => estado.navegar)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navegar(id)
          }
        })
      },
      { root: null, rootMargin: '-40% 0px -60% 0px' }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [id, navegar])

  return (
    <div id={id} ref={ref} className="scroll-mt-32">
      {children}
    </div>
  )
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

  const paso = PASOS_VIAJE.find((item) => item.id === pasoActual)

  return (
    <div className="text-enel-navy min-h-svh bg-[#f0eee6] font-sans">
      <Nav />
      <main ref={mainRef} className="min-h-screen pt-16">
        <SectionObserver id="portada">
          <PortadaDelViaje />
        </SectionObserver>

        {/* Esta barra se pegará al top al hacer scroll más allá de la portada */}
        <div className="sticky top-16 z-20 md:top-16">
          {pasoActual !== PASO_INICIAL && paso && <PasoHeader paso={paso} />}
        </div>

        <SectionObserver id="historia">
          <HistoriaSection />
        </SectionObserver>
        
        <SectionObserver id="cultura">
          <CulturaSection />
        </SectionObserver>
        
        <SectionObserver id="organigrama">
          <OrganigramaSection />
        </SectionObserver>

        <SectionObserver id="mapa">
          <MapaConcesionSection />
        </SectionObserver>

        <SectionObserver id="cadena">
          <CadenaValorSection />
        </SectionObserver>

        <SectionObserver id="politicas">
          <PoliticasISOSection />
        </SectionObserver>

        <SectionObserver id="galerias">
          <GaleriasSection />
        </SectionObserver>

        <SectionObserver id="cierre">
          <CierreSection />
          <Footer />
        </SectionObserver>
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
