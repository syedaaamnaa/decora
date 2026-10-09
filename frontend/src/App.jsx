import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import PublicLayout from '@/components/layout/PublicLayout'
import Preloader from '@/components/layout/Preloader'
import ScrollProgress from '@/components/layout/ScrollProgress'
import Cursor from '@/components/layout/Cursor'
import RouteScrollTop from '@/components/layout/RouteScrollTop'
import FloatingActions from '@/components/layout/FloatingActions'
import Loader from '@/components/ui/Loader'
import InquiryModal from '@/components/ui/InquiryModal'
import { InquiryProvider } from '@/context/InquiryProvider'

/* Public pages */
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const Products = lazy(() => import('@/pages/Products'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/* Admin */
const Login = lazy(() => import('@/pages/Login'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminHeroSlides = lazy(() => import('@/pages/admin/AdminHeroSlides'))
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminClients = lazy(() => import('@/pages/admin/AdminClients'))
const AdminTestimonials = lazy(() => import('@/pages/admin/AdminTestimonials'))
const AdminLeads = lazy(() => import('@/pages/admin/AdminLeads'))

export default function App() {
  const location = useLocation()
  const isAdminArea = location.pathname.startsWith('/admin')

  const publicRoutes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  const adminRoutes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="hero" element={<AdminHeroSlides />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="leads" element={<AdminLeads />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  return (
    <InquiryProvider>
      <RouteScrollTop />

      {!isAdminArea && (
        <>
          <Preloader />
          <ScrollProgress />
          <Cursor />
          <FloatingActions />
        </>
      )}

      {isAdminArea ? (
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-ink">
              <Loader full={false} label="Loading admin" />
            </div>
          }
        >
          <AnimatePresence mode="wait">{adminRoutes}</AnimatePresence>
        </Suspense>
      ) : (
        <PublicLayout>
          <Suspense
            fallback={
              <div className="flex min-h-[70vh] items-center justify-center pt-24">
                <Loader full={false} />
              </div>
            }
          >
            <AnimatePresence mode="wait">{publicRoutes}</AnimatePresence>
          </Suspense>
        </PublicLayout>
      )}

      <InquiryModal />
    </InquiryProvider>
  )
}
