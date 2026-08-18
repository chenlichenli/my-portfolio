import { Route, Routes } from 'react-router-dom'
import {
  About,
  Home,
  HubOnlineOrderingCaseStudy,
  IQueueForClinicsCaseStudy,
  MrdTestingJourneyCaseStudy,
  PlaceholderPage,
  SideWork,
  TempusOneCaseStudy,
} from './pages'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/side-work" element={<SideWork />} />
      <Route path="/about" element={<About />} />
      <Route path="/mrd-testing-journey" element={<MrdTestingJourneyCaseStudy />} />
      <Route path="/tempus-one" element={<TempusOneCaseStudy />} />
      <Route path="/hub-online-ordering" element={<HubOnlineOrderingCaseStudy />} />
      <Route path="/iqueue-for-clinics" element={<IQueueForClinicsCaseStudy />} />
      <Route path="*" element={<PlaceholderPage />} />
    </Routes>
  )
}
