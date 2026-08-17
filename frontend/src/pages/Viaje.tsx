import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { Nav } from '@/components/Nav'
import { PasoHeader } from '@/components/PasoPantalla'
import { PortadaDelViaje } from '@/components/PortadaDelViaje'
import { StormIntro, STORM_INTRO_CLAVE } from '@/components/StormIntro'
import { useAuthStore } from '@/store/useAuthStore'
import { useVideosStore } from '@/store/useVideosStore'
import { useViajeStore } from '@/store/useViajeStore'
import { PASOS_VIAJE } from '@/lib/data/viaje'
import { CierreSection, Footer } from '@/sections/CierreSection'
import { CulturaSection } from '@/sections/CulturaSection'
import { GaleriasSection } from '@/sections/GaleriasSection'
import { HistoriaSection } from '@/sections/HistoriaSection'
import { MapaConcesionSection } from '@/sections/MapaConcesionSection'
import { OrganigramaSection } from '@/sections/OrganigramaSection'
import { PoliticasISOSection } from '@/sections/PoliticasISOSection'
import { CadenaValorSection } from '@/sections/CadenaValorSection'

function SectionObserver({ id, children }: { id: string; children: React.ReactNode }) {
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
      { root: null, rootMargin: '-40% 0px -60% 0px' },
    )

    const nodo = document.getElementById(id)
    if (nodo) observer.observe(nodo)
    return () => observer.disconnect()
  }, [id, navegar])

  return <div className="scroll-mt-32">{children}</div>
}

export function Viaje() {
  const pasoActual = useViajeStore((estado) => estado.pasoActual)
  const initAnonymous = useAuthStore((estado) => estado.initAnonymous)
  const cargarVideos = useVideosStore((estado) => estado.cargar)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    void initAnonymous()
    void cargarVideos()
  }, [initAnonymous, cargarVideos])

  const paso = PASOS_VIAJE.find((item) => item.id === pasoActual)

  return (
    <div className="text-enel-navy min-h-svh bg-[#f0eee6] font-sans">
      <Nav />
      {(!import.meta.env.PROD || !sessionStorage.getItem(STORM_INTRO_CLAVE)) && <StormIntro />}
      <main className="min-h-screen pt-16">
        {paso && <PasoHeader paso={paso} />}

        <SectionObserver id="portada">
          <PortadaDelViaje />
        </SectionObserver>

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

        <div aria-hidden="true" className="pointer-events-none relative h-32 overflow-hidden md:h-40">
          <div className="bg-enel-red/20 absolute top-8 left-[10%] h-40 w-40 rounded-full blur-3xl" />
          <div className="absolute top-4 right-[15%] h-32 w-32 rounded-full bg-amber-300/40 blur-2xl" />
          <div className="absolute top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-emerald-400/30 blur-2xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="8 12" />
          </svg>
        </div>

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
