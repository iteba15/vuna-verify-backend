import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Verification', href: '/#verification' },
  { label: 'Platform', href: '/#platform' },
  { label: 'Impact', href: '/#impact' },
  { label: 'About', href: '/#about' },
  { label: 'Map', href: '/map', isRoute: true },
  { label: 'Dashboard', href: '/dashboard', isRoute: true },
];


export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavItem = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      return (
        <Link
          key={item.label}
          to={item.href}
          className={`nav-link ${location.pathname === item.href ? 'text-gold-warm' : ''}`}
        >
          {item.label}
        </Link>
      );
    }
    return (
      <a key={item.label} href={item.href} className="nav-link">
        {item.label}
      </a>
    );
  };

  const renderMobileNavItem = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      return (
        <Link
          key={item.label}
          to={item.href}
          className={`text-foreground/80 hover:text-gold-warm transition-colors py-2 ${location.pathname === item.href ? 'text-gold-warm' : ''
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
        </Link>
      );
    }
    return (
      <a
        key={item.label}
        href={item.href}
        className="text-foreground/80 hover:text-gold-warm transition-colors py-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.label}
      </a>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-forest-deep/95 backdrop-blur-md py-4 shadow-card'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-warm to-gold-light flex items-center justify-center">
            <span className="font-display font-bold text-xl text-forest-deep">V</span>
          </div>
          <span className="font-display text-2xl font-semibold text-foreground">
            Vuna<span className="text-gold-warm">Verify</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map(renderNavItem)}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/dashboard" className="btn-hero text-sm px-6 py-3">
            Enter Platform
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-forest-deep/98 backdrop-blur-md border-t border-border"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map(renderMobileNavItem)}
              <Link
                to="/dashboard"
                className="btn-hero text-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Enter Platform
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
