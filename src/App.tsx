import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import { ScrollToTop, SiteLayout } from './components/layout'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteLayout>
        <AppRoutes />
      </SiteLayout>
      <Analytics />
    </BrowserRouter>
  )
}
