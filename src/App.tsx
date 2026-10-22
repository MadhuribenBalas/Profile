import Footer from './components/Footer'
import Header from './components/Header'
import Certifications from './sections/Certifications'
import Contact from './sections/Contact'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Impact from './sections/Impact'
import Projects from './sections/Projects'
import Recognition from './sections/Recognition'
import Skills from './sections/Skills'

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <div className="scroll-progress" aria-hidden />
      <Header />
      <main id="main">
        <Hero />
        <Impact />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Recognition />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
