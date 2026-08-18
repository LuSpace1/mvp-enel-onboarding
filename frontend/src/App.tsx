import { preconnect, prefetchDNS } from 'react-dom'
import { Viaje } from '@/pages/Viaje'

preconnect('https://www.youtube.com')
preconnect('https://i.ytimg.com')
prefetchDNS('https://picsum.photos')

export function App() {
  return <Viaje />
}