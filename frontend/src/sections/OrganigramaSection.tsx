import { useState } from 'react'
import { VideoCamera, X } from '@phosphor-icons/react'

import { Modal } from '@/components/ui/Modal'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { track } from '@/lib/analytics'
import { areasStaff, gerenteGeneral, subgerencias } from '@/lib/data/organizacion'
import { videoDeSeccion } from '@/lib/data/videos'
import type { Subgerencia } from '@/types/api'

export function OrganigramaSection() {
  const [seleccionada, setSeleccionada] = useState<Subgerencia | null>(null)

  return (
    <SectionShell id="organigrama" className="bg-enel-mist" innerClassName="py-6">
      <Reveal className="max-w-2xl">
        <h2 className="text-enel-navy text-2xl font-semibold tracking-tight md:text-4xl">
          Quienes hacen posible la energía
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-start">
        <div>
          <Reveal delay={0.05}>
            <div className="border-enel-red shadow-enel-red/10 hover:shadow-enel-red/20 group relative overflow-hidden rounded-3xl border-2 bg-white shadow-xl transition">
              <div className="grid sm:grid-cols-[auto_1fr]">
                <div className="relative h-full min-h-56 w-full self-stretch sm:w-44">
                  <img
                    src={gerenteGeneral.foto}
                    alt={`${gerenteGeneral.nombre}, ${gerenteGeneral.cargo}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="bg-enel-red absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
                    Liderazgo
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="text-enel-red text-xs font-semibold tracking-[0.2em] uppercase">
                    {gerenteGeneral.cargo}
                  </p>
                  <h3 className="text-enel-navy mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                    {gerenteGeneral.nombre}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-neutral-500">
                    {gerenteGeneral.empresa}
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
                    Lidera la subsidiaria de distribución más grande de Chile, con el compromiso de
                    acercar la energía a más de dos millones de clientes con seguridad y cercanía.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              Áreas staff
            </p>
            <div className="flex flex-wrap gap-2">
              {areasStaff.map((area) => (
                <span
                  key={area.id}
                  className="border-enel-fog text-enel-navy hover:border-enel-red/50 inline-flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 text-xs font-medium transition"
                  title={area.detalle}
                >
                  {area.nombre}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-4 text-sm text-neutral-500">
              Las áreas staff dependen directamente de la Gerencia General y dan soporte transversal
              a todas las subgerencias.
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="border-enel-fog bg-enel-mist/20 self-start rounded-3xl border p-5"
        >
          <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
            <span className="bg-enel-red h-1.5 w-1.5 rounded-full" />
            Subgerencias de la división
          </p>
          <div className="grid gap-3">
            {subgerencias.map((subgerencia) => (
              <button
                key={subgerencia.id}
                type="button"
                onClick={() => {
                  setSeleccionada(subgerencia)
                  track('organigrama.subgerencia', { id: subgerencia.id })
                }}
                className="group border-enel-fog hover:border-enel-red/50 hover:shadow-enel-red/10 flex w-full items-center gap-4 rounded-2xl border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                data-analytics-component="organigrama"
                data-analytics-seccion={subgerencia.id}
              >
                <img
                  src={subgerencia.foto}
                  alt={`${subgerencia.subgerente}, Subgerencia ${subgerencia.sigla}`}
                  className="ring-enel-fog group-hover:ring-enel-red/50 h-14 w-14 shrink-0 rounded-full object-cover ring-2 transition"
                  loading="lazy"
                />
                <span className="min-w-0 flex-1">
                  <span className="text-enel-navy block truncate text-base leading-snug font-semibold">
                    {subgerencia.subgerente}
                  </span>
                  <span className="block truncate text-sm text-neutral-500">
                    {subgerencia.nombre}
                  </span>
                </span>
                <span className="bg-enel-navy hidden rounded-lg px-2 py-1 text-[10px] font-bold tracking-wide text-white sm:inline-block">
                  {subgerencia.sigla}
                </span>
                <VideoCamera
                  size={18}
                  weight="duotone"
                  className="text-enel-red shrink-0 opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-neutral-400">
            Toca una subgerencia para conocer su propósito y mensaje.
          </p>
        </Reveal>
      </div>

      <Modal
        abierto={seleccionada !== null}
        onCerrar={() => setSeleccionada(null)}
        analiticaId={seleccionada?.id}
      >
        {seleccionada && (
          <div>
            <div className="bg-enel-navy flex items-start justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <img
                  src={seleccionada.foto}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="text-enel-red text-xs font-semibold tracking-[0.2em] uppercase">
                    Subgerencia {seleccionada.sigla}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white md:text-2xl">
                    {seleccionada.nombre}
                  </h3>
                  <p className="mt-0.5 text-sm text-white/60">{seleccionada.subgerente}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSeleccionada(null)}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {(() => {
                const video = videoDeSeccion(seleccionada.videoSection)
                return video ? (
                  <VideoEmbed
                    youtubeUrl={video.youtube_url}
                    titulo={video.title}
                    posterSeed={`subgerencia-${seleccionada.id}`}
                    analiticaId={seleccionada.videoSection}
                  />
                ) : null
              })()}

              <p className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                {seleccionada.proposito}
              </p>
              <p className="mt-4 text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
                Principales procesos
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {seleccionada.procesos.map((proceso) => (
                  <span
                    key={proceso}
                    className="bg-enel-mist text-enel-navy rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {proceso}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </SectionShell>
  )
}
