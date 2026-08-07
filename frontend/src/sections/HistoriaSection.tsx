import { motion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { cadenaEnergia } from '@/lib/data/organizacion'
import { numerosClave } from '@/lib/data/galerias'

const filiales = [
  'Enel Green Power Chile',
  'Enel Generación Chile',
  'Enel Distribución',
  'Enel X Chile',
]

export function HistoriaSection() {
  return (
    <SectionShell id="historia" className="bg-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          El grupo que impulsa la energía del país
        </h2>
        <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg">
          Enel Chile S.A. es uno de los holdings eléctricos más importantes de Chile, constituido en
          2016 y parte de Enel SpA, compañía multinacional presente en más de 30 países. Enel
          Distribución Chile es la empresa de distribución de energía eléctrica más grande del país.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {filiales.map((filial) => (
            <span
              key={filial}
              className="border-enel-fog bg-enel-mist text-enel-navy rounded-full border px-4 py-1.5 text-sm font-medium"
            >
              {filial}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-16">
        <div className="border-enel-fog bg-enel-fog grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-4">
          {cadenaEnergia.map((etapa, indice) => (
            <motion.div
              key={etapa.titulo}
              className="group bg-white p-6"
              whileHover={{ backgroundColor: '#fdeef0' }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-enel-fog group-hover:text-enel-red text-3xl font-semibold transition-colors">
                {etapa.numero}
              </span>
              <h3 className="text-enel-navy mt-3 text-base font-semibold">{etapa.titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{etapa.descripcion}</p>
              {indice < cadenaEnergia.length - 1 && (
                <span className="text-enel-red mt-4 hidden sm:block" aria-hidden="true">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-16">
        <div className="bg-enel-navy rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
            {numerosClave.map((numero) => (
              <div key={numero.etiqueta} className="text-center">
                <p className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {numero.valor}
                  {numero.unidad && (
                    <span className="text-enel-red ml-1 text-lg">{numero.unidad}</span>
                  )}
                </p>
                <p className="mt-2 text-sm leading-snug text-white/60">{numero.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}
