import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CaretLeft,
  CaretRight,
  CornersIn,
  CornersOut,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { clsx } from 'clsx'

import { fotosEquipos } from '@/lib/data/galerias'
import { track } from '@/lib/analytics'

const POR_PAGINA = 10
const TOTAL_PAGINAS = Math.ceil(fotosEquipos.length / POR_PAGINA)
const DESTACADOS = new Set([0, 5])

const gridVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -60 : 60 }),
}

export function EquiposGaleria() {
  const reduce = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)
  const [spotActivo, setSpotActivo] = useState(false)
  const [pagina, setPagina] = useState(0)
  const [dirPagina, setDirPagina] = useState(0)
  const [abierto, setAbierto] = useState<number | null>(null)
  const [direccion, setDireccion] = useState(0)
  const [pantallaCompleta, setPantallaCompleta] = useState(false)

  const moverSpot = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = gridRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }

  const irPagina = (dir: number) => {
    setDirPagina(dir)
    setPagina((prev) => (prev + dir + TOTAL_PAGINAS) % TOTAL_PAGINAS)
    track('galeria.equipo.pagina', { pagina: ((pagina + dir + TOTAL_PAGINAS) % TOTAL_PAGINAS) + 1 })
  }

  const abrir = (indice: number) => {
    setDireccion(0)
    setPantallaCompleta(false)
    setAbierto(indice)
    track('galeria.equipo.abrir', { equipo: fotosEquipos[indice]?.titulo })
  }

  const cerrar = () => {
    setPantallaCompleta(false)
    setAbierto(null)
  }

  const navegar = (dir: number) => {
    setAbierto((prev) => {
      if (prev === null) return prev
      return (prev + dir + fotosEquipos.length) % fotosEquipos.length
    })
    setDireccion(dir)
  }

  useEffect(() => {
    if (abierto === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight') navegar(1)
      if (e.key === 'ArrowLeft') navegar(-1)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [abierto])

  const fotoActiva = abierto !== null ? fotosEquipos[abierto] : null
  const fotosPagina = fotosEquipos.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA)
  const desde = pagina * POR_PAGINA + 1
  const hasta = Math.min((pagina + 1) * POR_PAGINA, fotosEquipos.length)

  return (
    <div className="relative">
      {/* Grid asimétrico paginado */}
      <AnimatePresence initial={false} custom={dirPagina} mode="wait">
        <motion.div
          key={pagina}
          ref={gridRef}
          custom={dirPagina}
          variants={gridVariants}
          initial={reduce ? false : 'enter'}
          animate={reduce ? { opacity: 1, x: 0 } : 'center'}
          exit={reduce ? undefined : 'exit'}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={moverSpot}
          onMouseEnter={() => setSpotActivo(true)}
          onMouseLeave={() => setSpotActivo(false)}
          className="relative grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {fotosPagina.map((foto, indice) => {
            const indiceGlobal = pagina * POR_PAGINA + indice
            return (
              <motion.figure
                key={foto.titulo}
                className={clsx(
                  'group cv-auto bg-enel-mist relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 shadow-[0_10px_30px_rgba(20,50,90,0.14)]',
                  'transition-shadow duration-500 hover:z-30 hover:shadow-[0_28px_70px_-20px_rgba(0,111,187,0.45)]',
                  DESTACADOS.has(indice) && 'col-span-2',
                )}
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: reduce ? 0 : indice * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={reduce ? undefined : { y: -10, scale: 1.02 }}
                onClick={() => abrir(indiceGlobal)}
              >
                <img
                  src={foto.src}
                  alt={foto.titulo}
                  loading="lazy"
                  decoding="async"
                  className={clsx(
                    'aspect-[16/10] h-full w-full object-cover transition-transform duration-700',
                    reduce ? '' : 'group-hover:scale-105',
                  )}
                />

                {/* Sheen: barrido de luz sobre la tarjeta */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
                >
                  <div
                    className={clsx(
                      'absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent',
                      reduce
                        ? ''
                        : '-translate-x-[110%] transition-transform duration-700 ease-out group-hover:translate-x-[110%]',
                    )}
                  />
                </div>

                {/* Título siempre visible */}
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-14 pb-3 md:px-5 md:pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-enel-blue text-xl font-bold tracking-tight drop-shadow-sm md:text-2xl">
                      {String(indiceGlobal + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif text-lg font-medium text-white italic md:text-xl">
                      {foto.titulo}
                    </span>
                  </div>
                </figcaption>

                {/* Indicador de zoom en hover */}
                <span
                  aria-hidden="true"
                  className={clsx(
                    'absolute top-3 right-3 z-20 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition-opacity duration-300',
                    reduce ? 'opacity-0' : 'opacity-0 group-hover:opacity-100',
                  )}
                >
                  <MagnifyingGlass size={16} weight="bold" />
                </span>
              </motion.figure>
            )
          })}

          {/* Spotlight que sigue al cursor */}
          <div
            aria-hidden="true"
            className={clsx(
              'pointer-events-none absolute inset-0 z-30 transition-opacity duration-500',
              reduce || !spotActivo ? 'opacity-0' : 'opacity-100',
            )}
            style={{
              background:
                'radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(146, 208, 255, 0.30), rgba(146, 208, 255, 0.06) 40%, transparent 65%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Controles de paginación */}
      <div className="mt-10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => irPagina(-1)}
            aria-label="Ver 10 equipos anteriores"
            className="border-enel-fog/50 text-enel-navy hover:border-enel-blue hover:text-enel-blue rounded-full border bg-white/50 p-3 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <span className="text-sm font-bold tracking-widest text-neutral-500 uppercase">
            {desde}–{hasta} de {fotosEquipos.length}
          </span>
          <button
            onClick={() => irPagina(1)}
            aria-label="Ver 10 equipos siguientes"
            className="border-enel-fog/50 text-enel-navy hover:border-enel-blue hover:text-enel-blue rounded-full border bg-white/50 p-3 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Páginas de la galería">
          {Array.from({ length: TOTAL_PAGINAS }, (_, p) => (
            <button
              key={p}
              role="tab"
              aria-selected={p === pagina}
              aria-label={`Página ${p + 1}`}
              onClick={() => {
                setDirPagina(p > pagina ? 1 : -1)
                setPagina(p)
              }}
              className={clsx(
                'h-2.5 rounded-full transition-all duration-300',
                p === pagina ? 'bg-enel-blue w-8' : 'hover:bg-enel-blue/40 bg-enel-fog w-2.5',
              )}
            />
          ))}
        </div>
      </div>

      {/* Lightbox (portaled a document.body para que cubra el viewport real) */}
      {createPortal(
        <AnimatePresence initial={false} custom={direccion} mode="wait">
          {fotoActiva && (
            <motion.div
              key={abierto}
              className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onTouchStart={(e) => {
                touchX.current = e.touches[0]?.clientX ?? null
              }}
              onTouchEnd={(e) => {
                if (touchX.current === null) return
                const endX = e.changedTouches[0]?.clientX ?? touchX.current
                const delta = endX - touchX.current
                touchX.current = null
                if (Math.abs(delta) > 50) navegar(delta < 0 ? 1 : -1)
              }}
            >
              {pantallaCompleta ? (
                /* ---- Nivel 2: imagen en pantalla completa ---- */
                <motion.div
                  key="completa"
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex min-h-0 flex-1 items-center justify-center bg-black"
                >
                  <img
                    src={fotoActiva.src}
                    alt={fotoActiva.titulo}
                    onClick={() => setPantallaCompleta(false)}
                    className="max-h-full max-w-full cursor-zoom-out object-contain"
                  />

                  <button
                    onClick={() => navegar(-1)}
                    aria-label="Equipo anterior"
                    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20 md:left-6"
                  >
                    <CaretLeft size={28} weight="bold" />
                  </button>

                  <button
                    onClick={() => navegar(1)}
                    aria-label="Equipo siguiente"
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20 md:right-6"
                  >
                    <CaretRight size={28} weight="bold" />
                  </button>

                  <button
                    onClick={cerrar}
                    aria-label="Cerrar galería"
                    className="absolute top-4 right-4 z-10 rounded-full p-3 text-white transition-colors hover:bg-white/20"
                  >
                    <X size={24} weight="bold" />
                  </button>

                  <button
                    onClick={() => setPantallaCompleta(false)}
                    aria-label="Volver a la vista con descripción"
                    className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    <CornersIn size={18} weight="bold" />
                    Salir de pantalla completa
                  </button>
                </motion.div>
              ) : (
                /* ---- Nivel 1: imagen completa + descripción ---- */
                <motion.div
                  key="detalle"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  {/* Barra superior */}
                  <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 md:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-enel-blue text-xl font-bold tracking-tight md:text-2xl">
                        {String((abierto ?? 0) + 1).padStart(2, '0')}
                      </span>
                      <h3 className="truncate font-serif text-lg font-medium text-white italic md:text-xl">
                        {fotoActiva.titulo}
                      </h3>
                      <span className="hidden shrink-0 text-sm font-semibold tracking-widest text-white/40 uppercase sm:block">
                        {(abierto ?? 0) + 1} / {fotosEquipos.length}
                      </span>
                    </div>
                    <button
                      onClick={cerrar}
                      aria-label="Cerrar galería"
                      className="rounded-full p-3 text-white transition-colors hover:bg-white/20"
                    >
                      <X size={24} weight="bold" />
                    </button>
                  </div>

                  {/* Área de imagen (completa, sin cortes) */}
                  <div
                    className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20"
                    onMouseDown={(e) => {
                      if (e.target === e.currentTarget) cerrar()
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) cerrar()
                    }}
                  >
                    <button
                      onClick={() => navegar(-1)}
                      aria-label="Equipo anterior"
                      className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20 md:left-6"
                    >
                      <CaretLeft size={28} weight="bold" />
                    </button>

                    <button
                      onClick={() => navegar(1)}
                      aria-label="Equipo siguiente"
                      className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20 md:right-6"
                    >
                      <CaretRight size={28} weight="bold" />
                    </button>

                    <img
                      src={fotoActiva.src}
                      alt={fotoActiva.titulo}
                      onClick={() => setPantallaCompleta(true)}
                      className="max-h-full max-w-full cursor-zoom-in rounded-lg object-contain shadow-2xl ring-1 ring-white/20"
                    />

                    <span className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-medium whitespace-nowrap text-white/80 backdrop-blur-sm">
                      <CornersOut size={16} weight="bold" />
                      Clic en la imagen para pantalla completa
                    </span>
                  </div>

                  {/* Panel de descripción */}
                  <div className="shrink-0 border-t border-white/10 px-4 py-4 md:px-6">
                    <div className="mx-auto flex max-w-3xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                        {fotoActiva.descripcion}
                      </p>
                      <span className="text-sm font-bold tracking-widest text-white/40 uppercase md:hidden">
                        {(abierto ?? 0) + 1} / {fotosEquipos.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
