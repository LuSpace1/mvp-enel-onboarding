import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CaretDown, MapPin, Minus, Plus } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import type { Feature } from 'geojson'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { Reveal } from '@/components/ui/Reveal'
import { comunasGeoJSON, nombreComuna } from '@/lib/data/comunas'
import { ZONAS_CONCESION, ZONA_POR_ID, zonaDeComuna } from '@/lib/data/zonas'
import { track } from '@/lib/analytics'

interface ComunaFeature extends Feature {
  properties: {
    id: string
    nombre: string
  }
}

const featuresDeZona = (zonaId: string): ComunaFeature[] =>
  (comunasGeoJSON.features as ComunaFeature[]).filter((f) =>
    ZONA_POR_ID.get(zonaId)?.comunas.includes(f.properties.id),
  )

const ESTILO_DEFAULT: L.PathOptions = { interactive: true }

function MapaInterior({
  zonaAbierta,
  zonaHover,
  comunaHover,
  onZonaHover,
  onComunaHover,
  onAbrirZona,
}: {
  zonaAbierta: string | null
  zonaHover: string | null
  comunaHover: string | null
  onZonaHover: (zonaId: string | null) => void
  onComunaHover: (comunaId: string | null) => void
  onAbrirZona: (zonaId: string) => void
}) {
  const geoRef = useRef<L.GeoJSON>(null)

  const zonaAbiertaRef = useRef(zonaAbierta)
  const zonaHoverRef = useRef(zonaHover)
  const comunaHoverRef = useRef(comunaHover)
  zonaAbiertaRef.current = zonaAbierta
  zonaHoverRef.current = zonaHover
  comunaHoverRef.current = comunaHover

  const aplicarEstilos = useCallback(() => {
    const geo = geoRef.current
    if (!geo) return

    geo.eachLayer((layer) => {
      const path = layer as L.Path & { feature?: ComunaFeature }
      const comunaId = path.feature?.properties.id
      if (!comunaId) return

      const zona = zonaDeComuna(comunaId)
      if (!zona) return

      const abierta = zonaAbiertaRef.current
      const enZonaAbierta = abierta !== null && zona.id === abierta
      const resaltada = comunaHoverRef.current === comunaId && enZonaAbierta

      let estilo: L.PathOptions
      if (resaltada) {
        estilo = {
          fillColor: zona.colorClaro,
          fillOpacity: 1,
          color: '#ffd700',
          weight: 3,
          opacity: 1,
        }
      } else if (abierta) {
        estilo = enZonaAbierta
          ? { fillColor: zona.color, fillOpacity: 0.9, color: zona.color, weight: 1.5, opacity: 1 }
          : {
              fillColor: zona.color,
              fillOpacity: 0.1,
              color: zona.color,
              weight: 0.8,
              opacity: 0.3,
            }
      } else {
        const iluminada = zonaHoverRef.current === zona.id
        estilo = {
          fillColor: zona.color,
          fillOpacity: iluminada ? 0.95 : 0.5,
          color: zona.color,
          weight: iluminada ? 2.4 : 1.2,
          opacity: iluminada ? 1 : 0.85,
        }
      }

      path.setStyle(estilo)

      const el = path.getElement() as HTMLElement | null
      if (el) {
        if (enZonaAbierta) {
          el.classList.add('en-zona-abierta')
        } else {
          el.classList.remove('en-zona-abierta')
          el.classList.remove('comuna-electricidad')
          el.removeAttribute('pathLength')
          el.style.strokeDasharray = ''
          el.style.filter = resaltada ? 'drop-shadow(0 0 10px rgba(255,255,255,0.95))' : ''
        }

        if (resaltada && enZonaAbierta) {
          el.classList.add('comuna-electricidad')
          el.setAttribute('pathLength', '1')
          el.style.strokeDasharray = '0.35 0.65'
          el.style.filter = ''
        } else if (enZonaAbierta) {
          el.classList.remove('comuna-electricidad')
          el.removeAttribute('pathLength')
          el.style.strokeDasharray = ''
          el.style.filter = ''
        }
      }

      if (enZonaAbierta) {
        const nombre = path.feature?.properties.nombre
        if (nombre && !path.getTooltip()) {
          path.bindTooltip(nombre, {
            permanent: true,
            direction: 'center',
            className: 'comuna-label',
          })
        }
      } else if (path.getTooltip()) {
        path.unbindTooltip()
      }
    })
  }, [])

  useEffect(() => {
    aplicarEstilos()
  }, [aplicarEstilos, zonaAbierta, zonaHover, comunaHover])

  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const comunaId = (feature.properties as { id: string }).id
      const zona = zonaDeComuna(comunaId)

      layer.on({
        mouseover: () => {
          if (zonaAbiertaRef.current) {
            if (zona?.id === zonaAbiertaRef.current) {
              onComunaHover(comunaId)
              track('mapa.comuna.hover', { comuna: comunaId })
            }
          } else if (zona) {
            onZonaHover(zona.id)
            track('mapa.zona.hover', { zona: zona.id })
          }
        },
        mouseout: () => {
          onComunaHover(null)
          onZonaHover(null)
        },
        click: () => {
          if (!zonaAbiertaRef.current && zona) {
            onAbrirZona(zona.id)
          }
        },
      })
    },
    [onZonaHover, onComunaHover, onAbrirZona],
  )

  return (
    <GeoJSON
      ref={geoRef}
      data={comunasGeoJSON}
      style={ESTILO_DEFAULT}
      onEachFeature={onEachFeature}
    />
  )
}

export function MapaConcesionSection() {
  const [zonaAbierta, setZonaAbierta] = useState<string | null>(null)
  const [zonaHover, setZonaHover] = useState<string | null>(null)
  const [comunaHover, setComunaHover] = useState<string | null>(null)
  const [leyendaMovil, setLeyendaMovil] = useState(false)
  const reduce = useReducedMotion()
  const mapRef = useRef<L.Map>(null)

  const boundsGenerales = useMemo(() => L.geoJSON(comunasGeoJSON).getBounds().pad(0.08), [])

  const zonaAbiertaData = zonaAbierta ? ZONA_POR_ID.get(zonaAbierta) : undefined
  const comunaHoverNombre = comunaHover ? nombreComuna(comunaHover) : null
  const zonaHoverData = zonaHover ? ZONA_POR_ID.get(zonaHover) : undefined

  const abrirZona = useCallback(
    (zonaId: string) => {
      const zona = ZONA_POR_ID.get(zonaId)
      if (!zona) return
      const bounds = L.geoJSON(featuresDeZona(zonaId) as Feature[])
        .getBounds()
        .pad(0.12)
      mapRef.current?.flyToBounds(bounds, {
        padding: [24, 24],
        duration: reduce ? 0 : 1.1,
        easeLinearity: 0.25,
      })
      setZonaAbierta(zonaId)
      setComunaHover(null)
      setZonaHover(null)
      setLeyendaMovil(false)
      track('mapa.zona.abrir', { zona: zonaId })
    },
    [reduce],
  )

  const cerrarZona = useCallback(() => {
    mapRef.current?.flyToBounds(boundsGenerales, {
      padding: [16, 16],
      duration: reduce ? 0 : 1.1,
      easeLinearity: 0.25,
    })
    setZonaAbierta(null)
    setComunaHover(null)
    setZonaHover(null)
    setLeyendaMovil(false)
    track('mapa.zona.cerrar')
  }, [boundsGenerales, reduce])

  return (
    <section id="mapa" className="relative overflow-hidden bg-[#f0eee6] py-14 md:py-20">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl px-5 md:px-8"
        initial={reduce ? false : { opacity: 0, y: -100 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ type: 'spring', stiffness: 35, damping: 14, mass: 1.4 }}
      >
        <div className="flex flex-col items-center text-center">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-enel-blue text-sm font-bold tracking-[0.2em] uppercase">
              Nuestra concesión
            </p>
            <h2 className="text-enel-navy mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              33 comunas que se encienden con nosotros
            </h2>
            <p className="mt-5 text-base leading-relaxed font-medium text-neutral-600">
              Organizamos nuestra red en 4 secciones de concesión —Chacabuco, Cordillera, Pacífico y
              Florida— que cubren gran parte de la Región Metropolitana. Toca una zona para explorar
              sus comunas.
            </p>

            <div className="text-enel-navy mx-auto mt-8 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
              <MapPin size={18} className="text-enel-blue shrink-0" weight="fill" />
              {comunaHoverNombre ? (
                <span className="text-enel-navy font-bold">{comunaHoverNombre}</span>
              ) : zonaHoverData ? (
                <span className="text-enel-navy flex items-center gap-2 font-bold">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: zonaHoverData.color }}
                  />
                  Zona {zonaHoverData.nombre}
                </span>
              ) : zonaAbiertaData ? (
                <span className="text-enel-navy flex items-center gap-2 font-bold">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: zonaAbiertaData.color }}
                  />
                  Zona {zonaAbiertaData.nombre} · {zonaAbiertaData.comunas.length} comunas
                </span>
              ) : (
                <span className="font-serif text-neutral-500 italic">
                  Toca una zona para explorar…
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="w-full">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-300 shadow-[0_24px_70px_-24px_rgba(10,25,47,0.45)]">
              <div className="h-[504px] sm:h-[648px]">
                <MapContainer
                  ref={mapRef}
                  bounds={boundsGenerales}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  attributionControl={false}
                  maxZoom={17}
                  minZoom={9}
                  className="h-full w-full bg-[#e8e4d8]"
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    detectRetina
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <MapaInterior
                    zonaAbierta={zonaAbierta}
                    zonaHover={zonaHover}
                    comunaHover={comunaHover}
                    onZonaHover={setZonaHover}
                    onComunaHover={setComunaHover}
                    onAbrirZona={abrirZona}
                  />
                </MapContainer>
              </div>

              {/* Botón volver */}
              <AnimatePresence>
                {zonaAbierta && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    onClick={cerrarZona}
                    className="absolute top-4 left-4 z-[1001] flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur transition-colors hover:bg-white"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    Volver a las zonas
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Controles de zoom */}
              <div className="absolute top-4 right-4 z-[1001] flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white/95 shadow-lg backdrop-blur">
                <button
                  type="button"
                  aria-label="Acercar mapa"
                  onClick={() => mapRef.current?.zoomIn()}
                  className="cursor-pointer px-3 py-2 transition-colors hover:bg-neutral-100"
                >
                  <Plus size={14} weight="bold" />
                </button>
                <div className="h-px bg-neutral-200" />
                <button
                  type="button"
                  aria-label="Alejar mapa"
                  onClick={() => mapRef.current?.zoomOut()}
                  className="cursor-pointer px-3 py-2 transition-colors hover:bg-neutral-100"
                >
                  <Minus size={14} weight="bold" />
                </button>
              </div>

              {/* Leyenda de zonas */}
              <AnimatePresence>
                {!zonaAbierta && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-4 left-1/2 z-[1001] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2"
                  >
                    {/* Desktop: barra horizontal */}
                    <div className="hidden flex-wrap justify-center gap-1.5 rounded-2xl border border-neutral-200 bg-white/90 p-1.5 shadow-lg backdrop-blur md:flex">
                      {ZONAS_CONCESION.map((zona) => (
                        <button
                          key={zona.id}
                          type="button"
                          onMouseEnter={() => setZonaHover(zona.id)}
                          onMouseLeave={() =>
                            setZonaHover((actual) => (actual === zona.id ? null : actual))
                          }
                          onClick={() => abrirZona(zona.id)}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all hover:bg-neutral-100 ${
                            zonaHover === zona.id ? 'bg-neutral-100' : ''
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full shadow-sm"
                            style={{ backgroundColor: zona.color }}
                          />
                          {zona.nombre}
                          <span className="text-xs font-semibold text-neutral-400">
                            {zona.comunas.length}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Móvil: botón compacto con desplegable */}
                    <div className="md:hidden">
                      <button
                        type="button"
                        onClick={() => setLeyendaMovil((abierta) => !abierta)}
                        className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-neutral-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur transition-colors hover:bg-white"
                      >
                        <span className="flex items-center gap-2.5 text-sm font-bold">
                          <span className="flex -space-x-1">
                            {ZONAS_CONCESION.map((zona) => (
                              <span
                                key={zona.id}
                                className="h-3 w-3 rounded-full ring-2 ring-white"
                                style={{ backgroundColor: zona.color }}
                              />
                            ))}
                          </span>
                          Zonas de concesión
                        </span>
                        <CaretDown
                          size={14}
                          weight="bold"
                          className={`text-neutral-400 transition-transform duration-200 ${
                            leyendaMovil ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {leyendaMovil && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1.5 flex flex-col rounded-2xl border border-neutral-200 bg-white/95 p-1.5 shadow-lg backdrop-blur">
                              {ZONAS_CONCESION.map((zona) => (
                                <button
                                  key={zona.id}
                                  type="button"
                                  onClick={() => abrirZona(zona.id)}
                                  className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors hover:bg-neutral-100"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <span
                                      className="h-3 w-3 rounded-full shadow-sm"
                                      style={{ backgroundColor: zona.color }}
                                    />
                                    {zona.nombre}
                                  </span>
                                  <span className="text-xs font-semibold text-neutral-400">
                                    {zona.comunas.length} comunas
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-[11px] font-medium tracking-wide text-neutral-400">
              <span>Mapa</span>
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="hover:text-enel-blue hover:decoration-enel-blue/40 text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors"
              >
                © OpenStreetMap
              </a>
              <span>·</span>
              <a
                href="https://carto.com/attributions"
                target="_blank"
                rel="noreferrer"
                className="hover:text-enel-blue hover:decoration-enel-blue/40 text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors"
              >
                Tiles © CARTO
              </a>
              <span>·</span>
              <span>Límites comunales: D.P.A. Chile</span>
            </p>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}
