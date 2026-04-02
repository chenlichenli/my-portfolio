import { Route, Routes } from 'react-router-dom'
import { About, Home, PlaceholderPage } from './pages'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/side-work"
        element={
          <PlaceholderPage
            title="Side Work"
            description="This page is ready for your side projects and experiments."
          />
        }
      />
      <Route path="/about" element={<About />} />
      <Route
        path="/tempus-one"
        element={
          <PlaceholderPage
            title="Tempus One"
            description="Case study content can replace this placeholder."
          />
        }
      />
      <Route
        path="/hub-online-ordering"
        element={
          <PlaceholderPage
            title="Hub Online Ordering"
            description="Case study content can replace this placeholder."
          />
        }
      />
      <Route
        path="/iqueue-for-clinics"
        element={
          <PlaceholderPage
            title="iQueue for Clinics"
            description="Case study content can replace this placeholder."
          />
        }
      />
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
