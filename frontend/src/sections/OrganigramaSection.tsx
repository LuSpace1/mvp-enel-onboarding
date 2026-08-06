import { useState } from 'react'
import { VideoCamera, X } from '@phosphor-icons/react'

import { Modal } from '@/components/ui/Modal'
import { Reveal } from '@/components/ui/Reveal'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { track } from '@/lib/analytics'
import { areasStaff, subgerencias } from '@/lib/data/organizacion'
import { videoDeSeccion } from '@/lib/data/videos'
import type { Subgerencia } from '@/types/api'

export function OrganigramaSection() {
  const [seleccionada, setSeleccionada] = useState<Subgerencia | null>(null)

  return (
    <section id="organigrama" className="bg-enel-mist py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
            ¿Quién lidera el cambio?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            Las subgerencias que hacen posible que la energía llegue, de forma segura y confiable, a
            la ciudad.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-14">
          <div className="mx-auto max-w-md text-center">
            <div className="border-enel-red bg-enel-red/5 rounded-2xl border-2 px-6 py-5 text-center">
              <p className="text-enel-red text-xs font-semibold tracking-[0.2em] uppercase">
                Gerente General
              </p>
              <p className="text-enel-navy mt-1 text-xl font-semibold">Mónica Hodor</p>
              <p className="text-sm text-neutral-500">Enel Distribución Chile</p>
            </div>
            <div className="bg-enel-fog mx-auto h-10 w-px" />
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              Áreas staff
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {areasStaff.map((area) => (
                <span
                  key={area.id}
                  className="border-enel-fog bg-enel-mist text-enel-navy rounded-full border px-3.5 py-1.5 text-xs font-medium"
                  title={area.detalle}
                >
                  {area.nombre}
                </span>
              ))}
            </div>
            <div className="bg-enel-fog mx-auto h-10 w-px" />
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {subgerencias.map((subgerencia, indice) => (
            <Reveal key={subgerencia.id} delay={indice * 0.05}>
              <button
                type="button"
                onClick={() => {
                  setSeleccionada(subgerencia)
                  track('organigrama.subgerencia', { id: subgerencia.id })
                }}
                className="group border-enel-fog hover:border-enel-red/50 hover:shadow-enel-red/10 flex h-full w-full flex-col rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-xl"
                data-analytics-component="organigrama"
                data-analytics-seccion={subgerencia.id}
              >
                <span className="bg-enel-navy inline-flex w-fit rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide text-white">
                  {subgerencia.sigla}
                </span>
                <span className="text-enel-navy mt-3 text-base leading-snug font-semibold">
                  {subgerencia.nombre}
                </span>
                <span className="mt-1 text-sm text-neutral-500">{subgerencia.subgerente}</span>
                <span className="text-enel-red mt-4 inline-flex items-center gap-1.5 text-xs font-semibold opacity-0 transition group-hover:opacity-100">
                  <VideoCamera size={14} weight="duotone" />
                  Ver video de bienvenida
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal
        abierto={seleccionada !== null}
        onCerrar={() => setSeleccionada(null)}
        analiticaId={seleccionada?.id}
      >
        {seleccionada && (
          <div>
            <div className="bg-enel-navy flex items-start justify-between gap-4 p-6">
              <div>
                <p className="text-enel-red text-xs font-semibold tracking-[0.2em] uppercase">
                  Subgerencia {seleccionada.sigla}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white md:text-2xl">
                  {seleccionada.nombre}
                </h3>
                <p className="mt-0.5 text-sm text-white/60">{seleccionada.subgerente}</p>
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
    </section>
  )
}
