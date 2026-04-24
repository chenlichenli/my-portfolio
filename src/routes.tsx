import { Route, Routes } from 'react-router-dom'
import {
  About,
  Home,
  HubOnlineOrderingCaseStudy,
  IQueueForClinicsCaseStudy,
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
      <Route path="/tempus-one" element={<TempusOneCaseStudy />} />
      <Route path="/hub-online-ordering" element={<HubOnlineOrderingCaseStudy />} />
      <Route path="/iqueue-for-clinics" element={<IQueueForClinicsCaseStudy />} />
      <Route
        path="*"
        element={
          <PlaceholderPage
            title="Page not found"
            description="That URL does not exist on this site."
          />
        }
      />
    </Routes>
  )
}
