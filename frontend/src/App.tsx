import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Viaje } from '@/pages/Viaje'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Viaje />,
  },
])

export function App() {
  return <RouterProvider router={router} />
}
