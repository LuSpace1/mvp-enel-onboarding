import { useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import type { MotionValue } from 'motion/react'
import { CaretRight } from '@phosphor-icons/react'

import { track } from '@/lib/analytics'
import logoEnel from '@/assets/icons/Enel_Group_logo.svg'
import videoIntro from '@/assets/videos/video4.mp4'

export const STORM_INTRO_CLAVE = 'enel-storm-intro-visto'

const CHISPAS = Array.from({ length: 22 }, (_, i) => {
  const angulo = (Math.PI * 2 * i) / 22 + (i % 2) * 0.15
  const radio = 90 + ((i * 43) % 90)
  const cian = i % 3 !== 0
  const tamanio = 4 + ((i * 7) % 6)
  return { angulo, radio, cian, tamanio, offset: i % 2 === 0 ? 0 : 0.035 }
})

// Esqueleto del logo Enel: cada pieza se dibuja por trazo conforme avanza el scroll.
const PIEZAS_LAZO: { d: string; ancho: number; tramo: [number, number] }[] = [
  { d: 'M 16 79.5 A 40 40 0 1 1 15.9 79.5', ancho: 15, tramo: [0.32, 0.38] }, // anillo izquierdo
  { d: 'M 257 79.5 A 40 40 0 1 1 256.9 79.5', ancho: 15, tramo: [0.35, 0.41] }, // anillo derecho
  { d: 'M 155 84 A 52 52 0 0 1 259 84', ancho: 15, tramo: [0.38, 0.44] }, // arco central
  { d: 'M 54 80 L 108 80', ancho: 12, tramo: [0.4, 0.45] }, // conector horizontal izq
  { d: 'M 293 80 L 349 80', ancho: 12, tramo: [0.42, 0.47] }, // conector horizontal der
  { d: 'M 127 40 L 127 94', ancho: 12, tramo: [0.44, 0.48] }, // viga izq
  { d: 'M 184 84 L 184 140', ancho: 12, tramo: [0.46, 0.5] }, // viga central
  { d: 'M 368 2 L 368 56', ancho: 12, tramo: [0.48, 0.52] }, // viga der
  { d: 'M 368 58 L 385 58 L 385 106 L 401 128', ancho: 12, tramo: [0.5, 0.54] }, // cola verde
]

function Chispa({
  prog,
  angulo,
  radio,
  tamanio,
  cian,
  offset,
}: {
  prog: MotionValue<number>
  angulo: number
  radio: number
  tamanio: number
  cian: boolean
  offset: number
}) {
  const x = useTransform(prog, [0.56 + offset, 0.78], [0, Math.cos(angulo) * radio])
  const y = useTransform(prog, [0.56 + offset, 0.78], [0, Math.sin(angulo) * radio])
  const opacity = useTransform(prog, [0.56 + offset, 0.6 + offset, 0.78], [0, 1, 0])
  const scale = useTransform(prog, [0.56 + offset, 0.7], [0.3, 1])

  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        x,
        y,
        scale,
        opacity,
        width: tamanio,
        height: tamanio,
        backgroundColor: cian ? '#35e6ff' : '#eafcff',
        boxShadow: cian
          ? '0 0 14px 3px rgba(53,230,255,0.75)'
          : '0 0 12px 2px rgba(224,250,255,0.75)',
      }}
    />
  )
}

// Una pieza del esqueleto del logo: se dibuja por trazo y al terminar una chispa
// amarilla recorre su longitud.
function PiezaLazo({
  prog,
  config,
}: {
  prog: MotionValue<number>
  config: (typeof PIEZAS_LAZO)[number]
}) {
  const [inicio, fin] = config.tramo
  const pathLength = useTransform(prog, config.tramo, [0, 1])
  const gate = useTransform(prog, [inicio, fin], [0, 1])
  const blipOff = useTransform(prog, [fin - 0.005, fin + 0.05], [0, 1])
  const blipOp = useTransform(prog, [fin - 0.005, fin + 0.015], [0, 1])

  return (
    <g>
      <motion.path
        d={config.d}
        fill="none"
        stroke="#0e4d7a"
        strokeWidth={config.ancho}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength, opacity: gate }}
      />
      <motion.path
        d={config.d}
        fill="none"
        stroke="#43e8ff"
        strokeWidth={config.ancho + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          pathLength: 0.05,
          pathOffset: blipOff,
          opacity: blipOp,
        }}
      />
    </g>
  )
}

// Anillo de energía que se expande y se desvanece en el clímax
function AnilloOnda({
  onda,
  gateLogo,
}: {
  onda: MotionValue<number>
  gateLogo: MotionValue<number>
}) {
  const escala = useTransform(() => 0.5 + 1.7 * onda.get())
  const opacidad = useTransform(() => (1 - onda.get()) * 0.4 * gateLogo.get())

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 rounded-full border-2 border-[#43e8ff]"
      style={{
        scale: escala,
        opacity: opacidad,
        boxShadow: '0 0 30px rgba(53,230,255,0.35), inset 0 0 30px rgba(53,230,255,0.2)',
      }}
    />
  )
}

// Partícula de luz que orbita alrededor del logo
function ParticulaOrbita({
  rotacion,
  gateLogo,
  color,
}: {
  rotacion: MotionValue<number>
  gateLogo: MotionValue<number>
  color: string
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-[-28%]"
      style={{ rotate: rotacion, opacity: gateLogo }}
    >
      <motion.span
        className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 14px 4px ${color}` }}
      />
    </motion.div>
  )
}

export function StormIntro() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const marcado = useRef(false)
  // La animación ligada al scroll solo corre en la primera pasada de cada carga de
  // página: al completarla (o saltarla) la escena queda en modo "logo radiante".
  const esPrimeraVez = useRef(true)
  const [introCompletado, setIntroCompletado] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progCrudo = useSpring(scrollYProgress, { stiffness: 28, damping: 22, restDelta: 0.0005 })
  // En modo radiante el progreso visual se fija en 0.8: escena final con el logo armado,
  // brillante y con telón abajo, sin ninguna animación ligada al scroll.
  const prog = useTransform(() => (esPrimeraVez.current ? progCrudo.get() : 0.8))

  useEffect(() => {
    track('intro.ver')
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!marcado.current && v >= 0.93) {
      marcado.current = true
      sessionStorage.setItem(STORM_INTRO_CLAVE, '1')
      track('intro.completar')
    }
    // Mostrar indicador de scroll cuando la animación visual va por buen camino
    if (!introCompletado && v >= 0.7) setIntroCompletado(true)
    // Primera pasada completada: la animación se fija en modo radiante
    if (esPrimeraVez.current && v >= 0.99) esPrimeraVez.current = false
  })

  const saltar = () => {
    marcado.current = true
    esPrimeraVez.current = false
    sessionStorage.setItem(STORM_INTRO_CLAVE, '1')
    track('intro.saltar')
    document.getElementById('portada')?.scrollIntoView({ behavior: 'smooth' })
  }

  const opCont = useTransform(prog, [0.86, 0.94], [1, 0])
  const scaleCont = useTransform(prog, [0.86, 0.94], [1, 0.96])
  const yCont = useTransform(prog, [0.86, 0.94], [0, -24])
  // Telón final: la escena se levanta hacia arriba revelando el contenido
  const yTelon = useTransform(prog, [0.94, 1], [0, '-100%'])

  const brillo = useTransform(prog, [0.52, 0.64], [0.4, 1.15])
  const gris = useTransform(prog, [0.52, 0.64], [1, 0])
  const gateLogo = useTransform(prog, [0.56, 0.64], [0, 1])
  // El logo aparece ENORME y se va contrayendo hasta su tamaño final mientras se arma
  const escalaLogo = useTransform(prog, [0.2, 0.6], [4.5, 1])
  const opOfficial = useTransform(prog, [0.56, 0.64], [0, 1])
  const opEsqueleto = useTransform(prog, [0.58, 0.66], [1, 0])
  const pulso = useMotionValue(0)

  useEffect(() => {
    const control = animate(pulso, [0, 1, 0.35, 0.8, 0.3], {
      duration: 2.4,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    return () => control.stop()
  }, [pulso])

  const imgFilter = useTransform(() => `brightness(${brillo.get()}) grayscale(${gris.get()})`)
  const haloEscala = useTransform(() => 0.9 + 0.5 * pulso.get() * gateLogo.get())
  const haloOp = useTransform(() => 0.25 + 0.65 * gateLogo.get())
  const latido = useTransform(() => escalaLogo.get() * (1 + 0.035 * pulso.get() * gateLogo.get()))

  const opEnel = useTransform(prog, [0.48, 0.58], [0, 1])
  const yEnel = useTransform(prog, [0.48, 0.58], [120, 0])
  const scaleEnel = useTransform(prog, [0.48, 0.58], [0.7, 1])
  const rotateEnel = useTransform(prog, [0.48, 0.58], [-4, 0])
  const opDist = useTransform(prog, [0.50, 0.62], [0, 1])
  const sxLinea = useTransform(prog, [0.56, 0.68], [0, 1])

  const escalaDestello = useTransform(prog, [0.56, 0.66], [0, 6.5])
  const opDestello = useTransform(prog, [0.56, 0.6, 0.66], [0, 0.9, 0])
  const escalaDestello2 = useTransform(prog, [0.58, 0.68], [0, 5.5])
  const opDestello2 = useTransform(prog, [0.58, 0.62, 0.68], [0, 0.8, 0])
  // Flash de luz de pantalla completa en el clímax
  const opFlash = useTransform(prog, [0.56, 0.585, 0.66], [0, 0.8, 0])

  // Ondas expansivas y partículas orbitales que acompañan el clímax
  const ondaA = useMotionValue(0)
  const ondaB = useMotionValue(0)
  const ondaC = useMotionValue(0)
  const rotacionA = useMotionValue(0)
  const rotacionB = useMotionValue(0)

  useEffect(() => {
    const controls = [
      animate(ondaA, [0, 1], { duration: 3, repeat: Infinity, ease: 'easeInOut' }),
      animate(ondaB, [0, 1], { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }),
      animate(ondaC, [0, 1], { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }),
      animate(rotacionA, 360, { duration: 7, repeat: Infinity, ease: 'linear' }),
      animate(rotacionB, -360, { duration: 11, repeat: Infinity, ease: 'linear', delay: 2.5 }),
    ]
    return () => controls.forEach((control) => control.stop())
  }, [ondaA, ondaB, ondaC, rotacionA, rotacionB])

  // Sacudida de pantalla al completarse el logo
  const sacudidaX = useMotionValue(0)
  const sacudidaY = useMotionValue(0)
  const sacudido = useRef(false)

  useMotionValueEvent(progCrudo, 'change', (v) => {
    if (v < 0.5) {
      sacudido.current = false
      return
    }
    if (!sacudido.current && v >= 0.58) {
      sacudido.current = true
      animate(sacudidaX, [0, -6, 4, -3, 2, -1, 0], { duration: 0.55, ease: 'easeOut' })
      animate(sacudidaY, [0, 4, -5, 3, -2, 1, 0], { duration: 0.55, ease: 'easeOut' })
    }
  })

  const chispas = useMemo(() => CHISPAS, [])
  const piezasLazo = useMemo(() => PIEZAS_LAZO, [])

  if (reduce) return null

  return (
    <section
      ref={ref}
      aria-label="Intro animado: tormenta eléctrica Enel"
      className="relative z-50 h-[300vh]"
    >
      <motion.div className="sticky top-0 h-screen overflow-hidden" style={{ y: yTelon }}>
        <motion.div className="absolute inset-0" style={{ x: sacudidaX, y: sacudidaY }}>
          {/* Video de fondo: Santiago en loop, al 100% */}
          <video
            src={videoIntro}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Destellos del clímax */}
          <motion.div
            className="absolute top-1/2 left-1/2 -mt-32 -ml-32 h-64 w-64 rounded-full bg-white mix-blend-screen blur-3xl"
            style={{ scale: escalaDestello, opacity: opDestello }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -mt-32 -ml-32 h-64 w-64 rounded-full bg-[#35e6ff] mix-blend-screen blur-3xl"
            style={{ scale: escalaDestello2, opacity: opDestello2 }}
          />

          {/* Flash de luz de pantalla completa */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-white"
            style={{ opacity: opFlash }}
          />

          {/* Chispas del clímax */}
          <div className="absolute top-1/2 left-1/2 h-0 w-0" aria-hidden="true">
            {chispas.map((chispa, i) => (
              <Chispa key={i} prog={prog} {...chispa} />
            ))}
          </div>

          {/* Contenido central: el logo se arma pieza a pieza */}
          <motion.div
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
            style={{ opacity: opCont, scale: scaleCont, y: yCont }}
          >
            <motion.div style={{ scale: latido }} className="relative w-[min(84vw,540px)]">
              {/* Ondas de energía que se expanden al completarse el logo */}
              <div className="absolute inset-[-8%] -z-10">
                <AnilloOnda onda={ondaA} gateLogo={gateLogo} />
                <AnilloOnda onda={ondaB} gateLogo={gateLogo} />
                <AnilloOnda onda={ondaC} gateLogo={gateLogo} />
                {/* Partículas de luz orbitando el logo */}
                <ParticulaOrbita rotacion={rotacionA} gateLogo={gateLogo} color="#43e8ff" />
                <ParticulaOrbita rotacion={rotacionB} gateLogo={gateLogo} color="#ffffff" />
              </div>
              {/* Halo de energía (blur estático, solo escala/opacidad animadas) */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-[-18%] -z-10 rounded-full"
                style={{
                  scale: haloEscala,
                  opacity: haloOp,
                  background:
                    'radial-gradient(circle, rgba(53,230,255,0.35) 0%, rgba(43,110,255,0.16) 45%, transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />
              <div className="relative">
                {/* Esqueleto que se dibuja con el scroll */}
                <motion.svg
                  viewBox="0 0 400 144"
                  aria-hidden="true"
                  className="h-auto w-full"
                  style={{ opacity: opEsqueleto }}
                >
                  {piezasLazo.map((pieza, i) => (
                    <PiezaLazo key={i} prog={prog} config={pieza} />
                  ))}
                </motion.svg>
                {/* Logo oficial iluminado al completarse */}
                <motion.img
                  src={logoEnel}
                  alt="Logo Enel"
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ opacity: opOfficial, filter: imgFilter }}
                />
              </div>
            </motion.div>

            <motion.h1
              style={{ opacity: opEnel, y: yEnel, scale: scaleEnel, rotate: rotateEnel }}
              className="text-enel-navy mt-4 text-5xl leading-[1.02] font-semibold tracking-tighter sm:text-6xl md:text-7xl"
            >
              Enel{' '}
              <motion.span style={{ opacity: opDist }} className="text-enel-red">
                Distribución
              </motion.span>
            </motion.h1>
            <motion.div
              style={{ scaleX: sxLinea }}
              className="mt-5 h-1 w-14 rounded-full bg-[#35e6ff] shadow-[0_0_12px_rgba(53,230,255,0.8)]"
            />
            <motion.p
              style={{ opacity: opDist }}
              className="bg-enel-navy/40 mt-6 max-w-md rounded-full px-6 py-3 text-sm leading-relaxed text-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md md:text-base"
            >
              La energía que llega a tu casa empieza mucho antes. Sigue su viaje por nuestra red.
            </motion.p>
          </motion.div>

          {/* Indicador de scroll – estilo Apple, solo tras completar la intro */}
          {introCompletado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
            >
              <span className="text-[13px] font-semibold tracking-[0.28em] uppercase text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                Desplázate
              </span>
              <div className="relative flex flex-col items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                    className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]"
                  >
                    <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
                      <path
                        d="M2 2L14 12L26 2"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Escape */}
        <button
          type="button"
          onClick={saltar}
          className="text-enel-navy border-enel-navy/15 hover:border-enel-navy/30 absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full border bg-white/60 px-4 py-2 text-xs font-semibold shadow-[0_2px_8px_rgba(10,25,47,0.08)] backdrop-blur transition hover:bg-white"
        >
          Saltar intro
          <CaretRight size={13} weight="bold" />
        </button>
      </motion.div>
    </section>
  )
}
