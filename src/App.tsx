import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { SiteLayout } from './components/layout'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <SiteLayout>
        <AppRoutes />
      </SiteLayout>
    </BrowserRouter>
  )
}
