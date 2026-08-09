import { ArrowUp, Heart, Lightbulb } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { track } from '@/lib/analytics'
import fotoMUT from '@/assets/images/MUT.jpg'

export function CierreSection() {
  const reduce = useReducedMotion()

  return (
    <section id="cierre" className="bg-enel-navy relative flex min-h-[72dvh] items-center overflow-hidden py-24 md:min-h-[80dvh] md:py-36">
      <div className="pointer-events-none absolute inset-0">
        <motion.img
          src={fotoMUT}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.55]"
          initial={reduce ? false : { scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 2.0, ease: [0.25, 1, 0.5, 1] }}
        />
        <motion.div
          className="from-enel-navy via-enel-navy/70 to-enel-navy-soft/30 absolute inset-0 bg-gradient-to-t"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
            La energía que mueve a dos millones de clientes se construye todos los días
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Cada proyecto, cada persona y cada proceso de esta página forma parte de la transición
            energética que impulsa al país. Sigue explorando y comparte lo que aprendas.
          </p>
          
          <motion.div 
            className="mx-auto mt-12 flex justify-center text-amber-400"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          >
            <Lightbulb size={56} weight="duotone" />
          </motion.div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
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
