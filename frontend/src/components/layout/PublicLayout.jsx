import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Chrome for all public routes. Page transitions are handled by the
 * AnimatePresence tree passed in as children.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col" id="top">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
