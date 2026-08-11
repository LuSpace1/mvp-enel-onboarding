import { ArrowRight } from '@phosphor-icons/react'

import { etapasCadena } from '@/lib/data/organizacion'

const ETIQUETAS_ETAPA: Record<string, string> = {
  customer: 'Relación con el cliente',
  strategy: 'Estrategia',
  supply: 'Abastecimiento',
  engineering: 'Ingeniería',
  construction: 'Construcción y operación',
  cash: 'Servicio a cliente',
}

function EtapaCard({ indice }: { indice: number }) {
  const etapa = etapasCadena[indice]
  if (!etapa) return null
  return (
    <article
      className="group border-enel-fog hover:border-enel-red/40 hover:shadow-enel-red/10 relative flex h-64 w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      data-analytics-component="cadena-valor"
      data-analytics-etapa={etapa.id}
    >
      <span className="text-enel-fog/70 group-hover:text-enel-red/15 absolute -top-5 -right-3 text-[88px] leading-none font-semibold transition-colors">
        {String(indice + 1).padStart(2, '0')}
      </span>
      <div>
        <h3 className="text-enel-navy text-lg leading-snug font-semibold tracking-tight md:text-2xl">
          {etapa.titulo}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">
          {etapa.descripcion}
        </p>
      </div>
      <span className="text-enel-red flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
        {ETIQUETAS_ETAPA[etapa.id] ?? `Etapa ${indice + 1}`}
        <ArrowRight
          size={14}
          weight="bold"
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </article>
  )
}

export function CadenaValorSection() {
  return (
    <section id="cadena" className="relative overflow-hidden bg-[#f0eee6]">
      <style>{`
        @keyframes float-continuous {
          0%, 100% { transform: translateY(-12px); }
          50% { transform: translateY(12px); }
        }
        .animate-float-card {
          animation: float-continuous 3s ease-in-out infinite;
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 35s linear infinite;
        }
      `}</style>

      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-32 md:px-8 md:pt-40">
        <div className="max-w-2xl">
          <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
            Cómo creamos valor, de punta a punta
          </h2>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-neutral-600 md:text-lg">
            Seis etapas que llevan la energía desde la estrategia hasta el cliente, en un recorrido
            continuo de creación de valor.
          </p>
        </div>
      </div>

      {/* Carrusel Horizontal Infinito (Marquee) */}
      <div
        className="relative z-10 mx-auto mt-20 w-full max-w-[80vw] overflow-hidden pt-10 pb-40"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="animate-scroll flex w-max gap-8 px-4 hover:[animation-play-state:paused]">
          {[...etapasCadena, ...etapasCadena].map((etapa, idx) => (
            <div
              key={`${etapa.id}-${idx}`}
              className="animate-float-card w-[320px] shrink-0 md:w-[380px]"
              style={{ animationDelay: `${(idx % 2) * 1.5}s` }}
            >
              <EtapaCard indice={idx % etapasCadena.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
