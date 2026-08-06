import { lazy, Suspense, useEffect } from 'react'
import { Toaster } from 'sonner'

import { Nav } from '@/components/Nav'
import { useAuthStore } from '@/store/useAuthStore'
import { useVideosStore } from '@/store/useVideosStore'
import { RutaEntreJuegos } from '@/games/shared'
import { CadenaValorSection } from '@/sections/CadenaValorSection'
import { CierreSection, Footer } from '@/sections/CierreSection'
import { CulturaSection } from '@/sections/CulturaSection'
import { GaleriasSection } from '@/sections/GaleriasSection'
import { HeroSection } from '@/sections/HeroSection'
import { HistoriaSection } from '@/sections/HistoriaSection'
import { MapaConcesionSection } from '@/sections/MapaConcesionSection'
import { OrganigramaSection } from '@/sections/OrganigramaSection'
import { PoliticasISOSection } from '@/sections/PoliticasISOSection'

const Memorama = lazy(() =>
  import('@/games/Memorama').then((modulo) => ({ default: modulo.Memorama })),
)
const CadenaValorOrden = lazy(() =>
  import('@/games/CadenaValorOrden').then((modulo) => ({ default: modulo.CadenaValorOrden })),
)
const MatchAreas = lazy(() =>
  import('@/games/MatchAreas').then((modulo) => ({ default: modulo.MatchAreas })),
)
const Acrostico = lazy(() =>
  import('@/games/Acrostico').then((modulo) => ({ default: modulo.Acrostico })),
)
const TimelineHistorico = lazy(() =>
  import('@/games/TimelineHistorico').then((modulo) => ({ default: modulo.TimelineHistorico })),
)

function SuspenseJuego({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-enel-fog/40 mx-auto h-72 w-full max-w-3xl animate-pulse rounded-3xl" />
      }
    >
      {children}
    </Suspense>
  )
}

export function Viaje() {
  const initAnonymous = useAuthStore((state) => state.initAnonymous)
  const cargarVideos = useVideosStore((state) => state.cargar)

  useEffect(() => {
    void initAnonymous()
    void cargarVideos()
  }, [initAnonymous, cargarVideos])

  return (
    <div className="text-enel-navy min-h-svh bg-white font-sans">
      <Nav />
      <main>
        <HeroSection />
        <HistoriaSection />
        <RutaEntreJuegos>
          <SuspenseJuego>
            <Memorama />
          </SuspenseJuego>
        </RutaEntreJuegos>
        <CulturaSection />
        <OrganigramaSection />
        <RutaEntreJuegos tono="claro">
          <SuspenseJuego>
            <MatchAreas />
          </SuspenseJuego>
        </RutaEntreJuegos>
        <MapaConcesionSection />
        <CadenaValorSection />
        <RutaEntreJuegos>
          <SuspenseJuego>
            <CadenaValorOrden />
          </SuspenseJuego>
        </RutaEntreJuegos>
        <PoliticasISOSection />
        <RutaEntreJuegos>
          <SuspenseJuego>
            <Acrostico />
          </SuspenseJuego>
        </RutaEntreJuegos>
        <GaleriasSection />
        <RutaEntreJuegos>
          <SuspenseJuego>
            <TimelineHistorico />
          </SuspenseJuego>
        </RutaEntreJuegos>
        <CierreSection />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
