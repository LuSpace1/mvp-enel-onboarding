export function track(evento: string, datos?: unknown) {
  console.info(`[analytics] ${evento}`, datos ?? '')
}
