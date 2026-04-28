import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { ScrollToTop, SiteLayout } from './components/layout'
import { LanguageProvider } from './i18n/LanguageContext'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ScrollToTop />
        <SiteLayout>
          <AppRoutes />
        </SiteLayout>
      </LanguageProvider>
    </BrowserRouter>
  )
}
