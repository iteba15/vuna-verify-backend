import { motion } from 'framer-motion';
import { ChevronDown, Satellite, Cpu, Radio } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section id="home" className="hero-section min-h-screen flex items-center relative">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 pattern-topo opacity-50" />
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-forest-light/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-gold-warm/5 blur-3xl" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-light/20 border border-forest-light/30"
            >
              <span className="w-2 h-2 rounded-full bg-gold-warm animate-pulse" />
              <span className="text-sm text-gold-warm font-medium">Kenya's First Physics-Backed Carbon Verification</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground">
              Restoring{' '}
              <span className="text-gradient-gold">Trust</span>{' '}
              to Africa's Carbon Markets
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              We are the first platform to fuse{' '}
              <span className="text-gold-warm">NASA Satellite data</span> with proprietary{' '}
              <span className="text-gold-warm">IoT ground sensors</span> to validate{' '}
              <em>active</em> carbon sequestration — not just greenness.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#platform" className="btn-hero">
                Enter Platform
              </a>
              <a href="#verification" className="btn-outline-light">
                How It Works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-gold-warm" />
                <span>NASA Partnership</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gold-warm" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-gold-warm" />
                <span>Real-Time IoT</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main visual container */}
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Orbital rings */}
              <div className="absolute inset-0 rounded-full border border-forest-light/20 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-8 rounded-full border border-forest-light/15 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
              <div className="absolute inset-16 rounded-full border border-gold-warm/10 animate-spin" style={{ animationDuration: '20s' }} />
              
              {/* Center element */}
              <div className="absolute inset-24 rounded-full bg-gradient-to-br from-forest-light/40 to-forest-mid/40 backdrop-blur-sm flex items-center justify-center border border-forest-light/30">
                <div className="text-center">
                  <div className="stat-highlight text-4xl">90%</div>
                  <p className="text-sm text-muted-foreground mt-2">Credits<br />Validated</p>
                </div>
              </div>

              {/* Floating data points */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-12 px-4 py-2 rounded-lg bg-forest-mid/80 backdrop-blur-sm border border-forest-light/20"
              >
                <p className="text-xs text-gold-warm font-medium">Satellite Feed</p>
                <p className="text-lg font-semibold text-foreground">Live ●</p>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-16 left-4 px-4 py-2 rounded-lg bg-forest-mid/80 backdrop-blur-sm border border-forest-light/20"
              >
                <p className="text-xs text-gold-warm font-medium">IoT Sensors</p>
                <p className="text-lg font-semibold text-foreground">2,847 Active</p>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 right-0 px-4 py-2 rounded-lg bg-forest-mid/80 backdrop-blur-sm border border-gold-warm/20"
              >
                <p className="text-xs text-gold-warm font-medium">Carbon Flux</p>
                <p className="text-lg font-semibold text-foreground">+12.4 tCO₂/ha</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#verification" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-gold-warm transition-colors">
            <span className="text-sm">Explore</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
