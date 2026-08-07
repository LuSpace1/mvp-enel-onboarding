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
    <SectionShell id="politicas" className="bg-white">
      <Reveal className="max-w-2xl">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Nuestro marco de actuación
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
          Cinco políticas que orientan la forma en que trabajamos cada día. Accede a la versión
          completa en SharePoint.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {principal && (
          <Reveal className="lg:row-span-2">
            <a
              href={principal.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: principal.id })}
              className="group bg-enel-navy hover:shadow-enel-navy/30 flex h-full flex-col justify-between rounded-3xl p-8 text-white transition hover:-translate-y-1 hover:shadow-2xl"
              data-analytics-component="iso"
              data-analytics-politica={principal.id}
            >
              <span className="bg-enel-red flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                <Certificate size={24} weight="duotone" />
              </span>
              <div className="mt-10">
                <h3 className="text-2xl font-semibold tracking-tight">{principal.nombre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{principal.resumen}</p>
              </div>
              <span className="text-enel-red mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                Abrir política
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </Reveal>
        )}

        {resto.map((politica, indice) => (
          <Reveal key={politica.id} delay={indice * 0.06}>
            <a
              href={politica.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('iso.abrir', { politica: politica.id })}
              className="group border-enel-fog hover:border-enel-red/40 hover:shadow-enel-red/10 flex h-full flex-col rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
              data-analytics-component="iso"
              data-analytics-politica={politica.id}
            >
              <span className="bg-enel-mist text-enel-red group-hover:bg-enel-red flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:text-white">
                <ArrowUpRight size={20} weight="bold" />
              </span>
              <h3 className="text-enel-navy mt-5 text-lg font-semibold tracking-tight">
                {politica.nombre}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{politica.resumen}</p>
            </a>
          </Reveal>
        ))}

        <Reveal delay={0.2} className="md:col-span-2 lg:col-span-1">
          <div className="border-enel-fog flex h-full flex-col justify-center rounded-3xl border border-dashed bg-white/60 p-6">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              Marco ampliado
            </p>
            <ul className="mt-3 space-y-2">
              {politicasExtra.map((politica) => (
                <li key={politica.id}>
                  <a
                    href={politica.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track('iso.abrir', { politica: politica.id })}
                    className={clsx(
                      'group text-enel-navy inline-flex items-center gap-1.5 text-sm font-medium',
                      'hover:text-enel-red transition',
                    )}
                  >
                    {politica.nombre}
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      className="text-enel-red opacity-0 transition group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
