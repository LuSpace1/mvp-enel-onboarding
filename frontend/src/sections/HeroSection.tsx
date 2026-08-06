import { ArrowDown, PlayCircle } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { track } from '@/lib/analytics'
import { videoDeSeccion } from '@/lib/data/videos'
import { VideoEmbed } from '@/components/ui/VideoEmbed'

const CONTENEDOR = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

export function HeroSection() {
  const reduce = useReducedMotion()
  const video = videoDeSeccion('hero_main')

  return (
    <section id="inicio" className="bg-enel-navy relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.9) 1px, transparent 0)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-44">
        <div className="bg-enel-red/25 h-96 w-full rounded-[50%] blur-[120px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 md:px-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div variants={reduce ? undefined : CONTENEDOR} initial="hidden" animate="show">
          <motion.p
            variants={ITEM}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase"
            data-analytics-component="hero"
            data-analytics-estado="visible"
          >
            <span className="bg-enel-red h-1.5 w-1.5 rounded-full" />
            Onboarding · Enel Distribución Chile
          </motion.p>

          <motion.h1
            variants={ITEM}
            className="max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            La energía se mueve. <span className="text-enel-red">Nosotros la llevamos</span> a tu
            ciudad.
          </motion.h1>

          <motion.p
            variants={ITEM}
            className="mt-5 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
          >
            Descubre el negocio, la cultura y el equipo que lleva energía segura a más de 2 millones
            de clientes.
          </motion.p>

          <motion.div variants={ITEM} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#historia"
              onClick={() => track('hero.cta.comenzar')}
              className="bg-enel-red shadow-enel-red/30 hover:bg-enel-red-dark inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 active:translate-y-0"
              data-analytics-component="hero"
              data-analytics-accion="comenzar"
            >
              Comenzar el viaje
              <ArrowDown size={18} weight="bold" />
            </a>
            <a
              href="#organigrama"
              onClick={() => track('hero.cta.organizacion')}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              <PlayCircle size={18} weight="duotone" />
              Conocer el equipo
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {video && (
            <VideoEmbed
              youtubeUrl={video.youtube_url}
              titulo={video.title}
              posterSeed="monica-hodor-bienvenida"
              analiticaId="hero_main"
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}
