export function track(evento: string, datos?: unknown) {
  console.info(`[analytics] ${evento}`, datos ?? '')
}

export function dataAnalytics(atributos: Record<string, string>) {
  return Object.fromEntries(Object.entries(atributos).map(([key, value]) => [`data-${key}`, value]))
}
