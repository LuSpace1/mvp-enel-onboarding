import { ArrowUpRight, Certificate } from '@phosphor-icons/react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { track } from '@/lib/analytics'
import { politicasExtra, politicasISO } from '@/lib/data/iso'
import { clsx } from 'clsx'

export function PoliticasISOSection() {
  const principal = politicasISO[0]
  const resto = politicasISO.slice(1)

  return (
    <SectionShell id="politicas" className="bg-[#f0eee6] relative overflow-hidden">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      <style>{`
        @keyframes march-politicas {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        .animate-march-politicas {
          animation: march-politicas 1.5s linear infinite;
        }
      `}</style>
      <Reveal className="max-w-2xl relative z-10">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Nuestro marco de actuación
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
          Cinco políticas que orientan la forma en que trabajamos cada día. Accede a la versión
          completa en SharePoint.
        </p>
      </Reveal>

      {/* Layout Desktop (Zigzag) */}
      <div className="hidden md:flex flex-col relative z-10 mx-auto w-full max-w-5xl px-5 md:px-8 pb-20 pt-10">
        {[
          // Bloque 0: Principal
          principal && (
            <a
              key={principal.id}
              href={principal.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: principal.id })}
              className="group bg-enel-navy hover:shadow-enel-navy/30 relative flex w-full max-w-md min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
              data-analytics-component="iso"
              data-analytics-politica={principal.id}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <span className="bg-enel-red relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                <Certificate size={24} weight="duotone" />
              </span>
              <div className="mt-10 relative z-10">
                <h3 className="text-2xl font-semibold tracking-tight">{principal.nombre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{principal.resumen}</p>
              </div>
              <span className="text-enel-red mt-8 relative z-10 inline-flex items-center gap-2 text-sm font-semibold">
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
              className="group border-gray-300 hover:border-enel-red hover:shadow-enel-red/20 relative flex w-full max-w-md min-h-[250px] flex-col overflow-hidden rounded-3xl border-4 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3"
              data-analytics-component="iso"
              data-analytics-politica={politica.id}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <span className="bg-enel-mist text-enel-red group-hover:bg-enel-red relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:text-white">
                <ArrowUpRight size={20} weight="bold" />
              </span>
              <h3 className="text-enel-navy mt-5 relative z-10 text-lg font-semibold tracking-tight">
                {politica.nombre}
              </h3>
              <p className="mt-2 text-sm relative z-10 leading-relaxed text-neutral-600">{politica.resumen}</p>
            </a>
          )),
          
          <div key="marco" className="group border-gray-300 hover:border-enel-red hover:shadow-enel-red/20 transition-all duration-300 hover:-translate-y-3 relative flex w-full max-w-4xl min-h-[200px] flex-col justify-center overflow-hidden rounded-3xl border-4 border-dashed bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
              }}
            />
            <p className="text-[12px] relative z-10 font-bold tracking-[0.2em] text-neutral-400 uppercase text-center mb-8">
              Marco ampliado
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 relative z-10 w-full max-w-3xl mx-auto">
              {politicasExtra.map((politica, index) => {
                const isOddLast = index === politicasExtra.length - 1 && politicasExtra.length % 2 !== 0
                
                return (
                  <li key={politica.id} className={clsx("flex w-full", isOddLast && "md:col-span-2 md:w-1/2 md:mx-auto")}>
                    <a
                      href={politica.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track('iso.abrir', { politica: politica.id })}
                      className="group w-full flex justify-center text-center items-center gap-2 pb-3 text-base md:text-lg font-semibold text-enel-navy border-b-2 border-gray-200 hover:text-enel-red hover:border-enel-red transition-all"
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
          </div>
        ].filter(Boolean).map((CardComponent, idx, arr) => {
          const isLeft = idx % 2 === 0
          const isLast = idx === arr.length - 1
          
          const leftOffsets = ['ml-0', 'ml-12', 'ml-24']
          const rightOffsets = ['mr-0', 'mr-16', 'mr-8']
          const offsetClass = isLeft ? leftOffsets[idx / 2] : rightOffsets[Math.floor(idx / 2)]

          return (
            <div key={`row-${idx}`} className="relative flex w-full mb-16 min-h-[280px]">
              
              {!isLast && (
                <svg 
                  className="absolute top-[50%] left-0 w-full h-[100%] pointer-events-none z-0 opacity-60" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                >
                  {(() => {
                    const nextIsLast = idx === arr.length - 2;
                    const nextX = nextIsLast ? 50 : (isLeft ? 75 : 25);
                    const startX = isLeft ? 25 : 75;
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
                <div className="w-full flex justify-center relative z-10">
                  <Reveal delay={0.15} y={60} className="w-full flex justify-center">
                    {CardComponent}
                  </Reveal>
                </div>
              ) : isLeft ? (
                <>
                  <div className={`w-1/2 flex justify-center pr-8 ${offsetClass} relative z-10`}>
                    <Reveal delay={0.15} y={60} className="w-full flex justify-end">
                      {CardComponent}
                    </Reveal>
                  </div>
                  <div className="w-1/2" />
                </>
              ) : (
                <>
                  <div className="w-1/2" />
                  <div className={`w-1/2 flex justify-center pl-8 ${offsetClass} relative z-10`}>
                    <Reveal delay={0.15} y={60} className="w-full flex justify-start">
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
      <div className="flex md:hidden flex-col gap-6 mt-10 px-5 relative z-10">
        {[
          principal && (
            <a
              key={principal.id}
              href={principal.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: principal.id })}
              className="group bg-enel-navy hover:shadow-enel-navy/30 relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
                style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
              />
              <span className="bg-enel-red relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                <Certificate size={24} weight="duotone" />
              </span>
              <div className="mt-10 relative z-10">
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
              className="group border-gray-300 hover:border-enel-red hover:shadow-enel-red/20 relative flex h-full flex-col overflow-hidden rounded-3xl border-4 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{ backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
              />
              <span className="bg-enel-mist text-enel-red group-hover:bg-enel-red relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:text-white">
                <ArrowUpRight size={20} weight="bold" />
              </span>
              <h3 className="text-enel-navy mt-5 relative z-10 text-lg font-semibold tracking-tight">{politica.nombre}</h3>
            </a>
          )),
          <div key="marco" className="group hover:border-enel-red hover:shadow-enel-red/20 transition-all duration-300 hover:-translate-y-3 border-gray-300 relative flex h-full flex-col justify-center overflow-hidden rounded-3xl border-4 border-dashed bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
              style={{ backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
            />
            <p className="text-[12px] relative z-10 font-bold tracking-[0.2em] text-neutral-400 uppercase text-center mb-6">Marco ampliado</p>
            <ul className="flex flex-col gap-5 relative z-10">
              {politicasExtra.map((politica) => (
                <li key={politica.id} className="w-full">
                  <a href={politica.url} target="_blank" rel="noreferrer" className="group w-full flex justify-center text-center items-center gap-2 pb-3 text-base font-semibold text-enel-navy border-b-2 border-gray-200 hover:text-enel-red hover:border-enel-red transition-all">
                    {politica.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ].filter(Boolean).map((CardComponent, idx) => (
          <Reveal key={`mob-${idx}`} delay={0.1} y={40}>
            {CardComponent}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
