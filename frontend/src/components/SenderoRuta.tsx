import { useEffect, useRef, useState } from 'react'
import { CaretRight, Lightning } from '@phosphor-icons/react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { clsx } from 'clsx'

import type { PasoViaje } from '@/lib/data/viaje'
import { track } from '@/lib/analytics'
import { useViajeStore } from '@/store/useViajeStore'

const ANCHO = 1100
const ALTO = 620

const PUNTOS: readonly { x: number; y: number }[] = [
  { x: 130, y: 545 },
  { x: 260, y: 195 },
  { x: 470, y: 505 },
  { x: 690, y: 145 },
  { x: 800, y: 470 },
  { x: 955, y: 175 },
  { x: 1020, y: 405 },
  { x: 910, y: 550 },
]

function generarCamino(puntos: readonly { x: number; y: number }[]): string {
  const primero = puntos[0]
  if (!primero) return ''
  let d = `M${primero.x},${primero.y}`
  for (let i = 0; i < puntos.length - 1; i++) {
    const p0 = puntos[Math.max(0, i - 1)]!
    const p1 = puntos[i]!
    const p2 = puntos[i + 1]!
    const p3 = puntos[Math.min(puntos.length - 1, i + 2)]!
    const c1x = p1.x + (p2.x - p0.x) / 10
    const c1y = p1.y + (p2.y - p0.y) / 10
    const c2x = p2.x - (p3.x - p1.x) / 10
    const c2y = p2.y - (p3.y - p1.y) / 10
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`
  }
  return d
}

const CAMINO = generarCamino(PUNTOS)

function longitudesCamino(puntos: readonly { x: number; y: number }[]): number[] {
  const longitudes = [0]
  let acc = 0
  for (let i = 0; i < puntos.length - 1; i++) {
    const p0 = puntos[Math.max(0, i - 1)]!
    const p1 = puntos[i]!
    const p2 = puntos[i + 1]!
    const p3 = puntos[Math.min(puntos.length - 1, i + 2)]!
    const c1x = p1.x + (p2.x - p0.x) / 10
    const c1y = p1.y + (p2.y - p0.y) / 10
    const c2x = p2.x - (p3.x - p1.x) / 10
    const c2y = p2.y - (p3.y - p1.y) / 10
    const muestras = 24
    let prevX = p1.x
    let prevY = p1.y
    for (let t = 1; t <= muestras; t++) {
      const tt = t / muestras
      const u = 1 - tt
      const x =
        u * u * u * p1.x + 3 * u * u * tt * c1x + 3 * u * tt * tt * c2x + tt * tt * tt * p2.x
      const y =
        u * u * u * p1.y + 3 * u * u * tt * c1y + 3 * u * tt * tt * c2y + tt * tt * tt * p2.y
      acc += Math.hypot(x - prevX, y - prevY)
      prevX = x
      prevY = y
    }
    longitudes[i + 1] = acc
  }
  return longitudes
}

const LONGITUDES = longitudesCamino(PUNTOS)
const LARGO_TOTAL = LONGITUDES[LONGITUDES.length - 1] ?? 1
const POSICION_NODO = LONGITUDES.map((l) => l / LARGO_TOTAL)
const TRAIL_LARGO = 140
const TRAIL_CORTO = 70

function redirigir(paso: PasoViaje) {
  track('viaje.nodo', { paso: paso.id })
  const el = document.getElementById(paso.id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function SenderoRuta({ pasos }: { pasos: PasoViaje[] }) {
  const pasoActual = useViajeStore((estado) => estado.pasoActual)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const enVista = useInView(ref, { amount: 0.05 })

  const chispa = useMotionValue(0)
  const controlesChispa = useRef<ReturnType<typeof animate> | null>(null)
  const distanciaChispa = useTransform(chispa, (v) => `${v * 100}%`)
  const offsetTrailLargo = useTransform(chispa, (v) => `${LARGO_TOTAL - v * LARGO_TOTAL}px`)
  const offsetTrailCorto = useTransform(
    chispa,
    (v) => `${LARGO_TOTAL - v * LARGO_TOTAL + TRAIL_LARGO - TRAIL_CORTO}px`,
  )
  const [viajando, setViajando] = useState(false)

  const indiceMapa = pasos.findIndex((paso) => paso.id === 'mapa-del-viaje')
  const indiceActual = pasos.findIndex((paso) => paso.id === pasoActual)
  const posicionActualRef = useRef(0)
  posicionActualRef.current =
    POSICION_NODO[indiceActual >= 0 ? indiceActual : indiceMapa >= 0 ? indiceMapa : 0] ?? 0

  useEffect(() => {
    if (!enVista) return
    setViajando(false)
    controlesChispa.current?.stop()
    const objetivo = posicionActualRef.current
    if (reduce) {
      chispa.set(objetivo)
      return
    }
    if (Math.abs(objetivo - chispa.get()) < 0.005) return
    controlesChispa.current = animate(chispa, objetivo, {
      duration: 1.4,
      ease: [0.23, 1, 0.32, 1],
    })
    return () => controlesChispa.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enVista])

  const irAlPaso = (paso: PasoViaje, indice: number) => {
    const destino = POSICION_NODO[indice] ?? 0
    const desde = chispa.get()
    const distancia = Math.abs(destino - desde)

    if (reduce || !enVista || distancia < 0.005) {
      setViajando(false)
      redirigir(paso)
      return
    }

    controlesChispa.current?.stop()
    setViajando(true)
    controlesChispa.current = animate(chispa, destino, {
      duration: Math.min(0.7 + distancia * 3, 1.8),
      ease: [0.77, 0, 0.175, 1],
      onComplete: () => {
        setViajando(false)
        redirigir(paso)
      },
    })
  }

  return (
    <>
      <div ref={ref} className="relative mt-12 hidden md:block">
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          className="w-full"
          role="img"
          aria-label="Sendero con los capítulos del viaje numerados"
        >
          <defs>
            <linearGradient
              id="cableGrad"
              x1="0"
              y1="0"
              x2={ANCHO}
              y2={ALTO}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#006fbb" />
              <stop offset="60%" stopColor="#2f9be2" />
              <stop offset="100%" stopColor="#8bd0f6" />
            </linearGradient>
          </defs>
          <path
            d={CAMINO}
            fill="none"
            stroke="rgba(10, 25, 47, 0.08)"
            strokeWidth={12}
            strokeLinecap="round"
          />
          <path
            d={CAMINO}
            fill="none"
            stroke="url(#cableGrad)"
            strokeWidth={5.5}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 3px 10px rgba(0, 111, 187, 0.45))' }}
          />
          <path
            d={CAMINO}
            fill="none"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          {!reduce && (
            <path
              d={CAMINO}
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeDasharray="3 14"
              className="animate-march-sendero"
              style={{ animationPlayState: enVista ? 'running' : 'paused' }}
            />
          )}
          {PUNTOS.map((punto) => (
            <circle
              key={`conexion-${punto.x}-${punto.y}`}
              cx={punto.x}
              cy={punto.y}
              r={4.5}
              fill="#ffffff"
              opacity={0.9}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9))' }}
            />
          ))}
          {!reduce && (
            <g>
              <motion.path
                d={CAMINO}
                fill="none"
                stroke="#ffd02f"
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.16}
                strokeDasharray={`${TRAIL_LARGO} ${LARGO_TOTAL - TRAIL_LARGO}`}
                style={{
                  strokeDashoffset: offsetTrailLargo,
                  filter: 'drop-shadow(0 0 6px rgba(255, 208, 47, 0.5))',
                }}
              />
              <motion.path
                d={CAMINO}
                fill="none"
                stroke="#ffd02f"
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.5}
                strokeDasharray={`${TRAIL_CORTO} ${LARGO_TOTAL - TRAIL_CORTO}`}
                style={{ strokeDashoffset: offsetTrailCorto }}
              />
            </g>
          )}
          {!reduce && (
            <g>
              <motion.circle
                r={13}
                fill="#ffd02f"
                opacity={0.22}
                animate={{ scale: viajando ? 1.6 : 1 }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
                style={{
                  offsetPath: `path("${CAMINO}")`,
                  offsetDistance: distanciaChispa,
                  filter: 'drop-shadow(0 0 20px rgba(255, 208, 47, 0.55))',
                }}
              />
              <motion.circle
                r={7.5}
                fill="#ffd02f"
                animate={{ scale: viajando ? 1.4 : 1 }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
                style={{
                  offsetPath: `path("${CAMINO}")`,
                  offsetDistance: distanciaChispa,
                  filter: 'drop-shadow(0 0 8px rgba(255, 208, 47, 0.9))',
                }}
              />
              <circle
                r={2.6}
                fill="#fff8dc"
                className="chispa-sendero-sat"
                style={{
                  offsetPath: `path("${CAMINO}")`,
                  animationDelay: '-0.7s',
                  animationPlayState: enVista ? 'running' : 'paused',
                }}
              />
              <circle
                r={3.4}
                fill="#ffd02f"
                className="chispa-sendero-sat"
                style={{
                  offsetPath: `path("${CAMINO}")`,
                  animationDelay: '-1.4s',
                  animationPlayState: enVista ? 'running' : 'paused',
                }}
              />
              <circle
                r={2.4}
                fill="#fde68a"
                className="chispa-sendero-sat-rev"
                style={{
                  offsetPath: `path("${CAMINO}")`,
                  animationDelay: '-1.1s',
                  animationPlayState: enVista ? 'running' : 'paused',
                }}
              />
            </g>
          )}
        </svg>

        {PUNTOS.map((punto, indice) => {
          const paso = pasos[indice]
          if (!paso) return null
          const esActual = pasoActual === paso.id
          const nombreArriba = indice % 2 === 1
          const aLaDerecha = punto.x > ANCHO * 0.68
          const alCentro = !aLaDerecha && punto.x < ANCHO * 0.32

          return (
            <div
              key={paso.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(punto.x / ANCHO) * 100}%`,
                top: `${(punto.y / ALTO) * 100}%`,
              }}
            >
              <motion.button
                type="button"
                onClick={() => irAlPaso(paso, indice)}
                aria-label={`Ir a ${paso.nombre}`}
                initial={reduce ? false : 'oculto'}
                whileInView={reduce ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={reduce ? undefined : 'hover'}
                whileTap={reduce ? undefined : 'pulsado'}
                variants={{
                  oculto: { opacity: 0, scale: 0.85, y: 8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      duration: 0.5,
                      bounce: 0.2,
                      delay: indice * 0.07,
                    },
                  },
                  hover: {
                    scale: 1.08,
                    transition: { type: 'spring', duration: 0.35, bounce: 0.2 },
                  },
                  pulsado: {
                    scale: 0.95,
                    transition: { type: 'spring', duration: 0.15, bounce: 0.2 },
                  },
                }}
                className="group relative flex flex-col items-center"
                data-analytics-component="mapa-viaje"
                data-analytics-estado={paso.id}
              >
                {esActual && (
                  <span
                    aria-hidden="true"
                    className="animate-nodo-pulso border-enel-pink absolute inset-0 -m-2 rounded-full border-2"
                  />
                )}
                <motion.span
                  animate={!reduce && esActual ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className={clsx(
                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-bold transition-[color,background-color,border-color,box-shadow]',
                    esActual
                      ? 'border-enel-pink bg-enel-pink text-white shadow-[0_0_26px_-4px_rgba(235,0,83,0.7)]'
                      : 'border-enel-blue/60 to-enel-mist text-enel-blue group-hover:border-enel-blue bg-gradient-to-b from-white group-hover:shadow-[0_0_22px_-6px_rgba(0,111,187,0.55)]',
                  )}
                >
                  {indice + 1}
                </motion.span>

                <span
                  className={clsx(
                    'text-enel-navy absolute z-10 text-sm font-bold whitespace-nowrap',
                    nombreArriba ? 'bottom-full mb-3' : 'top-full mt-3',
                  )}
                >
                  <span className="relative inline-flex flex-col items-center">
                    {paso.nombre}
                    <AnimatePresence>
                      {esActual && (
                        <motion.span
                          key="aqui"
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.9 }}
                          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.9 }}
                          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                          className="bg-enel-pink mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
                        >
                          Estás aquí
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span className="text-enel-blue mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase opacity-0 transition-opacity group-hover:opacity-100">
                      Ir <CaretRight size={10} weight="bold" />
                    </span>
                  </span>
                </span>

                <motion.span
                  variants={{ hover: reduce ? { opacity: 1 } : { opacity: 1, scale: 1 } }}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    transformOrigin: `${alCentro ? 'center' : aLaDerecha ? 'right' : 'left'} ${nombreArriba ? 'top' : 'bottom'}`,
                  }}
                  className={clsx(
                    'border-enel-fog/70 pointer-events-none absolute z-20 w-56 overflow-hidden rounded-2xl border bg-white/90 p-4 shadow-[0_16px_40px_-16px_rgba(10,25,47,0.25)] backdrop-blur-md',
                    nombreArriba ? 'top-full mt-3' : 'bottom-full mb-3',
                    alCentro ? 'left-1/2 -translate-x-1/2' : aLaDerecha ? 'right-0' : 'left-0',
                  )}
                >
                  <span className="text-enel-blue flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] uppercase">
                    <Lightning size={12} weight="fill" />
                    Capítulo {indice + 1}
                  </span>
                  <span className="text-enel-navy mt-1.5 block font-bold">{paso.nombre}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-neutral-500">
                    {paso.descripcion}
                  </span>
                </motion.span>
              </motion.button>
            </div>
          )
        })}
      </div>

      <div className="mt-12 md:hidden">
        <ol className="relative flex flex-col gap-6 pl-2">
          <span
            aria-hidden="true"
            className="border-enel-blue/40 absolute top-3 bottom-3 left-[23px] border-l-2 border-dashed"
          />
          {pasos.map((paso, indice) => {
            const esActual = pasoActual === paso.id
            return (
              <li key={paso.id} className="relative">
                <motion.button
                  type="button"
                  onClick={() => irAlPaso(paso, indice)}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: indice * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="hover:border-enel-fog group flex w-full items-start gap-4 rounded-2xl border border-transparent p-2 text-left transition-colors hover:bg-white/70"
                  data-analytics-component="mapa-viaje"
                  data-analytics-estado={paso.id}
                >
                  <span
                    className={clsx(
                      'relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm transition-[color,background-color,border-color,box-shadow]',
                      esActual
                        ? 'border-enel-pink bg-enel-pink text-white shadow-[0_0_18px_-4px_rgba(235,0,83,0.55)]'
                        : 'text-enel-blue border-enel-blue/60 bg-white',
                    )}
                  >
                    <motion.span
                      animate={!reduce && esActual ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="flex items-center justify-center"
                    >
                      {indice + 1}
                    </motion.span>
                    {esActual && (
                      <span
                        aria-hidden="true"
                        className="animate-nodo-pulso border-enel-pink absolute inset-0 -m-1.5 rounded-full border-2"
                      />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={clsx(
                          'font-bold',
                          esActual ? 'text-enel-blue' : 'text-enel-navy',
                        )}
                      >
                        {paso.nombre}
                      </span>
                      <AnimatePresence>
                        {esActual && (
                          <motion.span
                            key="aqui"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.9 }}
                            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.9 }}
                            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-enel-pink rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
                          >
                            Estás aquí
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-neutral-500">
                      {paso.descripcion}
                    </span>
                    <span className="text-enel-blue mt-1 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase opacity-70 group-hover:opacity-100">
                      Ir al capítulo <Lightning size={10} weight="fill" />
                    </span>
                  </span>
                </motion.button>
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}
