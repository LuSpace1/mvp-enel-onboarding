import { useEffect, useState } from 'react'

interface UseActiveSectionOptions {
  ids: string[]
  margin?: string
}

export function useActiveSection({ ids, margin = '-45% 0px -50% 0px' }: UseActiveSectionOptions) {
  const [activa, setActiva] = useState(ids[0] ?? '')

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActiva(`#${entrada.target.id}`)
        }
      },
      { rootMargin: margin },
    )

    for (const id of ids) {
      const elemento = document.getElementById(id)
      if (elemento) observador.observe(elemento)
    }

    return () => observador.disconnect()
  }, [ids, margin])

  return activa
}
