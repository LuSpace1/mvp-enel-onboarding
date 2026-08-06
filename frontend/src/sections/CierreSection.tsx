import { ArrowUp, Heart } from '@phosphor-icons/react'

import { Reveal } from '@/components/ui/Reveal'
import { track } from '@/lib/analytics'

export function CierreSection() {
  return (
    <section id="cierre" className="bg-enel-navy relative overflow-hidden py-24 md:py-36">
      <div className="bg-enel-red/20 pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 w-[42rem] rounded-[50%] blur-[130px]" />

      <div className="relative mx-auto w-full max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="text-enel-red text-sm font-semibold tracking-[0.2em] uppercase">
            Bienvenido al equipo
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
            Hoy te sumas a las más de 500 personas que hacen posible que la energía llegue segura a
            millones de clientes
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Te deseamos mucho éxito en este nuevo camino profesional. El equipo de People &
            Organization está disponible para acompañarte en tu desarrollo.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#inicio"
              onClick={() => track('cierre.volver')}
              className="bg-enel-red hover:bg-enel-red-dark inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <ArrowUp size={18} weight="bold" />
              Volver al inicio
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-white/60">
              <Heart size={16} weight="duotone" className="text-enel-red" />
              Hecho con energía
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-enel-navy border-t border-white/10 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 text-center md:flex-row md:px-8 md:text-left">
        <p className="text-sm font-semibold text-white">Enel Distribución Chile</p>
        <p className="text-xs text-white/50">Portal Interactivo de Onboarding · Prototipo MVP</p>
      </div>
    </footer>
  )
}
