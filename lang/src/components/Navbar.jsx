import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ scrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ['home', 'about', 'languages', 'contact'];

  const handleNavClick = (section) => {
    scrollToSection(section);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl sticky top-4 z-50"
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              LangDetect
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-wrap justify-center gap-4">
            {navItems.map((item) => (
              <motion.button
                key={item}
                onClick={() => handleNavClick(item)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 text-sm rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 capitalize"
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* Hamburger Menu (Mobile only) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)} className="text-white">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Slide-in Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Optional background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-64 h-full bg-[#1a1a1a] z-50 shadow-lg flex flex-col p-6"
            >
              <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">LangDetect</h2>
                <button onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-300 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="w-full text-left px-2 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
