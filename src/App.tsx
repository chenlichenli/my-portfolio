import type { ReactNode } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { HeaderSocialNav } from './components/HeaderSocialNav'
import { Home } from './pages/Home'
import { PlaceholderPage } from './pages/PlaceholderPage'

const FOOTER_EMAIL = 'mailto:designer.chenli@gmail.com'
const FOOTER_LINKEDIN = 'https://www.linkedin.com/in/li-chen-8060b3155/'
const FOOTER_RESUME =
  'https://cdn.prod.website-files.com/663b86ab9b3d0891099847b0/67d088cada2c6cd7a6c22d32_Resume_Li%20Chen_2025.pdf'

/** Two stacked copies; hover slides vertically from the first line to the second. */
function PrimaryNavSlide({ label }: { label: string }) {
  return (
    <span className="site-nav-slide">
      <span className="site-nav-slide-track">
        <span className="site-nav-slide-line">{label}</span>
        <span className="site-nav-slide-line" aria-hidden="true">
          {label}
        </span>
      </span>
    </span>
  )
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-header-start">
            <NavLink
              to="/"
              className="site-logo"
              end
              aria-label="li.design — home"
            >
              <img
                className="site-logo-img"
                src="/logo.png"
                alt=""
                width={1024}
                height={1024}
                decoding="async"
              />
            </NavLink>
            <nav aria-label="Primary">
              <ul className="site-nav">
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
                    <PrimaryNavSlide label="Design" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/side-work"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <PrimaryNavSlide label="Side Work" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <PrimaryNavSlide label="About Me" />
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <HeaderSocialNav />
        </div>
      </header>

      <main className="site-main">
        {children}
        <div className="site-footer-divider" role="presentation">
          <span className="site-footer-divider-line" aria-hidden="true" />
          <span className="site-footer-divider-glyph" aria-hidden="true">
            ≽^•⩊•^≼
          </span>
          <span className="site-footer-divider-line" aria-hidden="true" />
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <nav className="site-footer-links" aria-label="Contact links">
            <a href={FOOTER_EMAIL}>Email →</a>
            <a href={FOOTER_LINKEDIN} target="_blank" rel="noreferrer">
              LinkedIn →
            </a>
            <a href={FOOTER_RESUME} target="_blank" rel="noreferrer">
              Resume →
            </a>
          </nav>
          <div className="site-footer-stack">
            <span className="site-footer-copyright">© Li Chen {new Date().getFullYear()}</span>
            <span className="site-footer-meta">
              <span>Updated 4/2026</span>
              <span aria-hidden="true">with</span>
              <span aria-label="love">💜</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
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
          <Route
            path="/about"
            element={
              <PlaceholderPage
                title="About Me"
                description="Add your story, process, and background here."
              />
            }
          />
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
      </Layout>
    </BrowserRouter>
  )
}
