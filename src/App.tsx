import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { DesktopPetShell } from './components/DesktopPet/DesktopPet'
import { ScrollToTop, SiteLayout } from './components/layout'
import { VercelAnalytics } from './components/VercelAnalytics'
import { LanguageProvider } from './i18n/LanguageContext'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <DesktopPetShell>
          <ScrollToTop />
          <SiteLayout>
            <AppRoutes />
          </SiteLayout>
        </DesktopPetShell>
      </LanguageProvider>
      {import.meta.env.PROD ? <VercelAnalytics /> : null}
    </BrowserRouter>
  )
}
