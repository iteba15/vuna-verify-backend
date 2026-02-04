import { motion } from 'framer-motion';
import { LayoutDashboard, Shield, FolderTree, MapPin, Users, HelpCircle } from 'lucide-react';

const platformFeatures = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Visualize forest health, carbon flux, and project boundaries in real-time. Track regulatory compliance and verified carbon uptake.',
    tag: 'Monitoring',
  },
  {
    icon: Shield,
    title: 'Verification Engine',
    description: 'Three-tiered verification combining satellite, IoT, and AI to deliver unmatched accuracy in carbon validation.',
    tag: 'Core Feature',
  },
  {
    icon: FolderTree,
    title: 'Projects',
    description: 'Explore active and archived carbon projects across Kenya. Filter by project type, verification status, and community impact.',
    tag: 'Explorer',
  },
  {
    icon: MapPin,
    title: 'VunaMap',
    description: 'Interactive geospatial tool for visualizing carbon flux, forest stress, and project boundaries with real-time data overlay.',
    tag: 'Geospatial',
  },
  {
    icon: Users,
    title: 'Consultancy',
    description: 'Partner with our team for REDD+ project design, MRV integration, regulatory compliance audits, and carbon risk assessments.',
    tag: 'Services',
  },
  {
    icon: HelpCircle,
    title: 'About',
    description: 'Learn about our mission, team, and the science behind VunaVerify. Discover how we are building trust in Africas carbon future.',
    tag: 'Learn More',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export const PlatformSection = () => {
  return (
    <section id="platform" className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-forest-deep" />
      <div className="absolute inset-0 pattern-organic opacity-40" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-warm/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-warm/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gold-warm/10 text-gold-warm text-sm font-medium mb-6">
            Platform Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Everything You Need for{' '}
            <span className="text-gradient-gold">Carbon Integrity</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive suite of tools designed for project developers, 
            corporate buyers, regulators, and communities.
          </p>
          <div className="section-divider mt-8" />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {platformFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="feature-card group cursor-pointer"
            >
              {/* Tag */}
              <span className="inline-block px-3 py-1 rounded-full bg-gold-warm/10 text-gold-warm text-xs font-medium mb-4">
                {feature.tag}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-forest-light/30 flex items-center justify-center mb-4 group-hover:bg-gold-warm/20 transition-colors">
                <feature.icon className="w-7 h-7 text-gold-warm" />
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

              {/* Hover arrow */}
              <div className="mt-6 flex items-center gap-2 text-gold-warm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Learn more</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <a href="#" className="btn-hero">
            Request Platform Access
          </a>
        </motion.div>
      </div>
    </section>
  );
};
