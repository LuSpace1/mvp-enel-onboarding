import { ArrowUpRight, Buildings } from '@phosphor-icons/react'

import { Reveal } from '@/components/ui/Reveal'
import { centroExcelencia, fotosEquipos, fotosMeOffice } from '@/lib/data/galerias'
import { track } from '@/lib/analytics'

export function GaleriasSection() {
  return (
    <section id="galerias" className="bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-enel-red text-sm font-semibold tracking-[0.2em] uppercase">
            Me Office
          </p>
          <h2 className="text-enel-navy mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Un espacio pensado para el equipo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            Conoce las oficinas donde el equipo construye el día a día del negocio.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fotosMeOffice.map((foto, indice) => (
            <Reveal key={foto.src} delay={indice * 0.05}>
              <figure className="group bg-enel-mist relative aspect-[3/2] overflow-hidden rounded-2xl">
                <img
                  src={foto.src}
                  alt={foto.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-10 pb-3 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {foto.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-enel-red text-sm font-semibold tracking-[0.2em] uppercase">
                Equipos
              </p>
              <h2 className="text-enel-navy mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Descubre al equipo
              </h2>
            </div>
          </div>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {fotosEquipos.map((foto) => (
              <figure key={foto.src} className="w-[min(78vw,380px)] shrink-0 snap-start">
                <div className="group bg-enel-mist relative aspect-4/5 overflow-hidden rounded-2xl">
                  <img
                    src={foto.src}
                    alt={foto.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-2 text-sm font-medium text-neutral-600">
                  {foto.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        {(() => {
          const centro = centroExcelencia
          return (
            <Reveal delay={0.1} className="mt-20">
              <div className="bg-enel-navy relative overflow-hidden rounded-3xl px-8 py-10 md:px-12 md:py-12">
                <div className="bg-enel-red/20 pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl" />
                <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                  <div>
                    <p className="text-enel-red text-sm font-semibold tracking-[0.2em] uppercase">
                      Donde entrenamos la seguridad
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-4xl">
                      {centro.titulo}
                    </h3>
                    <p className="mt-2 text-lg font-medium text-white/80">{centro.subtitulo}</p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
                      {centro.descripcion}
                    </p>
                    <a
                      href={centro.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track('ceo.abrir')}
                      className="bg-enel-red hover:bg-enel-red-dark mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"
                    >
                      <Buildings size={16} weight="duotone" />
                      Conoce el Centro de Excelencia
                      <ArrowUpRight size={16} weight="bold" />
                    </a>
                  </div>
                  <img
                    src="https://picsum.photos/seed/ceo-entrenamiento/640/480"
                    alt="Entrenamiento en el Centro de Excelencia Operacional"
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                </div>
              </div>
            </Reveal>
          )
        })()}
      </div>
    </section>
  )
}
