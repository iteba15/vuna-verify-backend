import { motion } from 'framer-motion';
import { Target, Eye, Lightbulb } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-forest-deep" />
      <div className="absolute inset-0 pattern-topo opacity-20" />
      
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-light/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-forest-light/20 text-gold-warm text-sm font-medium mb-6">
              About VunaVerify
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              The End of{' '}
              <span className="text-gradient-gold">Phantom Credits</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We are VunaVerify, a solution born from the urgent need to solve the 
              "integrity crisis" in the Voluntary Carbon Market (VCM). Currently, 
              up to 90% of rainforest offsets are labeled as "junk" because they rely 
              on outdated proxies like NDVI (greenness) that cannot distinguish between 
              a stressed forest and a healthy, carbon-absorbing one.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We are a team of scientists and engineers deploying the region's first 
              closed-loop verification system. By shifting the standard from simple 
              vegetation cover to <span className="text-gold-warm font-medium">active photosynthetic measurement</span>, 
              we bridge the gap between African project developers and global buyers 
              demanding high-integrity removal credits.
            </p>

            {/* Mission, Vision, Values */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-warm/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-gold-warm" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-foreground mb-1">Our Mission</h4>
                  <p className="text-muted-foreground">Restore trust and integrity to Africa's carbon markets through physics-backed verification.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-warm/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-gold-warm" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-foreground mb-1">Our Vision</h4>
                  <p className="text-muted-foreground">Position Kenya as the global hub for premium, high-integrity carbon assets.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-warm/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-gold-warm" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-foreground mb-1">Our Approach</h4>
                  <p className="text-muted-foreground">Fuse NASA satellite data with IoT ground sensors and AI analytics for unmatched verification accuracy.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Visual container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-forest-light/40 via-forest-mid/60 to-forest-deep" />
              
              {/* Pattern overlay */}
              <div className="absolute inset-0 pattern-organic opacity-30" />
              
              {/* Content cards */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Top stat */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="self-end bg-forest-deep/80 backdrop-blur-sm rounded-2xl p-6 border border-forest-light/20"
                >
                  <p className="text-gold-warm text-sm font-medium mb-1">Premium Credit Value</p>
                  <div className="stat-highlight text-4xl">$30</div>
                  <p className="text-xs text-muted-foreground mt-1">vs. $5 standard</p>
                </motion.div>

                {/* Middle info */}
                <div className="bg-forest-deep/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-warm/20 max-w-xs">
                  <p className="text-gold-warm font-medium mb-2">Climate Change Act 2024</p>
                  <p className="text-sm text-muted-foreground">
                    We act as the independent digital auditor required by Section 16(d) of the law.
                  </p>
                </div>

                {/* Bottom stat */}
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-forest-deep/80 backdrop-blur-sm rounded-2xl p-6 border border-forest-light/20 max-w-xs"
                >
                  <p className="text-gold-warm text-sm font-medium mb-1">Community Wealth</p>
                  <p className="text-foreground">40% mandatory profit share for local communities</p>
                </motion.div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full border border-gold-warm/20" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-forest-light/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
