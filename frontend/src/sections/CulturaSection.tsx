import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { pilaresCultura, valoresCultura } from '@/lib/data/cultura'

export function CulturaSection() {
  return (
    <SectionShell id="cultura" className="bg-white">
      <Reveal className="max-w-2xl">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Cómo trabajamos
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
          Nuestra cultura se construye día a día a través de acciones, decisiones y comportamientos
          que compartimos como equipo.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {pilaresCultura.map((pilar, indice) => (
          <Reveal
            key={pilar.id}
            delay={indice * 0.06}
            className={indice === pilaresCultura.length - 1 ? 'lg:col-span-2' : ''}
          >
            <article className="group border-enel-fog hover:border-enel-red/40 hover:shadow-enel-red/5 h-full rounded-2xl border bg-white p-7 transition hover:shadow-lg">
              <span className="bg-enel-red block h-1 w-8 rounded-full transition-all group-hover:w-12" />
              <h3 className="text-enel-navy mt-2 text-xl font-semibold tracking-tight">
                {pilar.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{pilar.descripcion}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {pilar.puntos.map((punto) => (
                  <li
                    key={punto}
                    className="bg-enel-mist text-enel-navy group-hover:bg-enel-red/10 group-hover:text-enel-red-dark rounded-full px-3 py-1 text-xs font-medium transition"
                  >
                    {punto}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-10">
        <div className="bg-enel-navy flex flex-col items-center gap-6 rounded-3xl px-8 py-10 md:flex-row md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Construir el futuro a través de la energía sustentable
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {valoresCultura.map((valor) => (
              <span
                key={valor.palabra}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                title={valor.descripcion}
              >
                {valor.palabra}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}
