import { ArrowUp, Heart } from '@phosphor-icons/react'

import { Reveal } from '@/components/ui/Reveal'
import { track } from '@/lib/analytics'

export function CierreSection() {
  return (
    <section id="cierre" className="bg-enel-navy relative overflow-hidden py-24 md:py-36">
      <div className="bg-enel-red/20 pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 w-[42rem] rounded-[50%] blur-[130px]" />

      <div className="relative mx-auto w-full max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
            La energía que mueve a dos millones de clientes se construye todos los días
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Cada proyecto, cada persona y cada proceso de esta página forma parte de la transición
            energética que impulsa al país. Sigue explorando y comparte lo que aprendas.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#inicio"
              onClick={() => track('cierre.volver')}
              className="bg-enel-pink hover:bg-enel-pink/80 border-enel-pink inline-flex h-12 items-center gap-2 rounded-full border-2 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
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
        <p className="text-xs text-white/50">Portal Interactivo Enel · Prototipo MVP</p>
      </div>
    </footer>
  )
}
