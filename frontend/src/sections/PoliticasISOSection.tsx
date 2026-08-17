import { ArrowUpRight, Certificate } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { track } from '@/lib/analytics'
import { politicasExtra, politicasISO } from '@/lib/data/iso'
import { clsx } from 'clsx'

export function PoliticasISOSection() {
  const principal = politicasISO[0]
  const resto = politicasISO.slice(1)
  const reduce = useReducedMotion()

  return (
    <SectionShell id="politicas" className="relative overflow-hidden bg-[#f0eee6] pb-2 md:pb-4">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 80, rotateX: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        style={{ perspective: 1200 }}
      >
      <Reveal className="relative z-10 max-w-2xl">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Nuestro marco de actuación
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
          Cinco políticas que orientan la forma en que trabajamos cada día. Accede a la versión
          completa en SharePoint.
        </p>
      </Reveal>

      {/* Layout Desktop (Zigzag) */}
      <div className="relative z-10 mx-auto hidden w-full max-w-5xl flex-col px-5 pt-10 pb-20 md:flex md:px-8">
        {[
          // Bloque 0: Principal
          principal && (
            <a
              key={principal.id}
              href={principal.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: principal.id })}
              className="group bg-enel-navy hover:shadow-enel-navy/30 relative flex min-h-[300px] w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
              style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
              data-analytics-component="iso"
              data-analytics-politica={principal.id}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <span className="bg-enel-red relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                <Certificate size={24} weight="duotone" />
              </span>
              <div className="relative z-10 mt-10">
                <h3 className="text-2xl font-semibold tracking-tight">{principal.nombre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{principal.resumen}</p>
              </div>
              <span className="text-enel-red relative z-10 mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                Abrir política
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          ),

          // Bloques 1-4: Resto de políticas
          ...resto.map((politica) => (
            <a
              key={politica.id}
              href={politica.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: politica.id })}
              className="group hover:border-enel-red hover:shadow-enel-red/20 relative flex min-h-[250px] w-full max-w-md flex-col overflow-hidden rounded-3xl border-4 border-gray-300 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3"
              style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
              data-analytics-component="iso"
              data-analytics-politica={politica.id}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <span className="bg-enel-mist text-enel-red group-hover:bg-enel-red relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:text-white">
                <ArrowUpRight size={20} weight="bold" />
              </span>
              <h3 className="text-enel-navy relative z-10 mt-5 text-lg font-semibold tracking-tight">
                {politica.nombre}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-neutral-600">
                {politica.resumen}
              </p>
            </a>
          )),

          <div
            key="marco"
            className="group hover:border-enel-red hover:shadow-enel-red/20 relative flex min-h-[200px] w-full max-w-4xl flex-col justify-center overflow-hidden rounded-3xl border-4 border-dashed border-gray-300 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-3"
            style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
              }}
            />
            <p className="relative z-10 mb-8 text-center text-[12px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Marco ampliado
            </p>
            <ul className="relative z-10 mx-auto grid w-full max-w-3xl grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
              {politicasExtra.map((politica, index) => {
                const isOddLast =
                  index === politicasExtra.length - 1 && politicasExtra.length % 2 !== 0

                return (
                  <li
                    key={politica.id}
                    className={clsx(
                      'flex w-full',
                      isOddLast && 'md:col-span-2 md:mx-auto md:w-1/2',
                    )}
                  >
                    <a
                      href={politica.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track('iso.abrir', { politica: politica.id })}
                      className="group text-enel-navy hover:text-enel-red hover:border-enel-red flex w-full items-center justify-center gap-2 border-b-2 border-gray-200 pb-3 text-center text-base font-semibold transition-all md:text-lg"
                    >
                      {politica.nombre}
                      <ArrowUpRight
                        size={18}
                        weight="bold"
                        className="text-enel-red opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>,
        ]
          .filter(Boolean)
          .map((CardComponent, idx, arr) => {
            const isLeft = idx % 2 === 0
            const isLast = idx === arr.length - 1

            const leftOffsets = ['ml-0', 'ml-12', 'ml-24']
            const rightOffsets = ['mr-0', 'mr-16', 'mr-8']
            const offsetClass = isLeft ? leftOffsets[idx / 2] : rightOffsets[Math.floor(idx / 2)]

            return (
              <div key={`row-${idx}`} className="relative mb-16 flex min-h-[280px] w-full">
                {!isLast && (
                  <svg
                    className="pointer-events-none absolute top-[50%] left-0 z-0 h-[100%] w-full opacity-60"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {(() => {
                      const nextIsLast = idx === arr.length - 2
                      const nextX = nextIsLast ? 50 : isLeft ? 75 : 25
                      const startX = isLeft ? 25 : 75
                      return (
                        <path
                          d={`M ${startX},0 C ${startX},50 ${nextX},50 ${nextX},100`}
                          stroke="#ef1e25"
                          strokeWidth="4"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          strokeDasharray="10,10"
                          className="animate-march-politicas"
                        />
                      )
                    })()}
                  </svg>
                )}

                {isLast ? (
                  <div className="relative z-10 flex w-full justify-center">
                    <Reveal delay={0.15} y={60} className="flex w-full justify-center">
                      {CardComponent}
                    </Reveal>
                  </div>
                ) : isLeft ? (
                  <>
                    <div className={`flex w-1/2 justify-center pr-8 ${offsetClass} relative z-10`}>
                      <Reveal delay={0.15} y={60} className="flex w-full justify-end">
                        {CardComponent}
                      </Reveal>
                    </div>
                    <div className="w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="w-1/2" />
                    <div className={`flex w-1/2 justify-center pl-8 ${offsetClass} relative z-10`}>
                      <Reveal delay={0.15} y={60} className="flex w-full justify-start">
                        {CardComponent}
                      </Reveal>
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>

      {/* Layout Móvil (Lista simple vertical) */}
      <div className="relative z-10 mt-10 flex flex-col gap-6 px-5 md:hidden">
        {[
          principal && (
            <a
              key={principal.id}
              href={principal.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: principal.id })}
              className="group bg-enel-navy hover:shadow-enel-navy/30 relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
              style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <span className="bg-enel-red relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                <Certificate size={24} weight="duotone" />
              </span>
              <div className="relative z-10 mt-10">
                <h3 className="text-2xl font-semibold tracking-tight">{principal.nombre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{principal.resumen}</p>
              </div>
            </a>
          ),
          ...resto.map((politica) => (
            <a
              key={politica.id}
              href={politica.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: politica.id })}
              className="group hover:border-enel-red hover:shadow-enel-red/20 relative flex h-full flex-col overflow-hidden rounded-3xl border-4 border-gray-300 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3"
              style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <span className="bg-enel-mist text-enel-red group-hover:bg-enel-red relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:text-white">
                <ArrowUpRight size={20} weight="bold" />
              </span>
              <h3 className="text-enel-navy relative z-10 mt-5 text-lg font-semibold tracking-tight">
                {politica.nombre}
              </h3>
            </a>
          )),
          <div
            key="marco"
            className="group hover:border-enel-red hover:shadow-enel-red/20 relative flex h-full flex-col justify-center overflow-hidden rounded-3xl border-4 border-dashed border-gray-300 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-3"
            style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
              }}
            />
            <p className="relative z-10 mb-6 text-center text-[12px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Marco ampliado
            </p>
            <ul className="relative z-10 flex flex-col gap-5">
              {politicasExtra.map((politica) => (
                <li key={politica.id} className="w-full">
                  <a
                    href={politica.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group text-enel-navy hover:text-enel-red hover:border-enel-red flex w-full items-center justify-center gap-2 border-b-2 border-gray-200 pb-3 text-center text-base font-semibold transition-all"
                  >
                    {politica.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>,
        ]
          .filter(Boolean)
          .map((CardComponent, idx) => (
            <Reveal key={`mob-${idx}`} delay={0.1} y={40}>
              {CardComponent}
            </Reveal>
          ))}
      </div>
      </motion.div>
    </SectionShell>
  )
}
