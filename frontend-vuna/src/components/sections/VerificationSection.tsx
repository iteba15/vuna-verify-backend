import { motion } from 'framer-motion';
import { Satellite, Radio, Brain, CheckCircle2 } from 'lucide-react';

const verificationTiers = [
  {
    icon: Satellite,
    title: 'Satellite Monitoring',
    subtitle: 'NASA & ESA Data Integration',
    description: 'We leverage NASA Satellite imagery and prepare for ESA FLEX mission data to monitor carbon flux, forest health, and biomass changes across project boundaries.',
    features: [
      'Real-time vegetation analysis',
      'Photosynthetic activity measurement',
      'Forest boundary tracking',
      'Historical trend analysis',
    ],
  },
  {
    icon: Radio,
    title: 'IoT Ground Sensors',
    subtitle: 'Proprietary Sensor Network',
    description: 'Our network of ground-based IoT sensors provides continuous, granular data on soil carbon, moisture levels, and micro-climate conditions.',
    features: [
      'Soil carbon measurement',
      'Real-time environmental data',
      'Tamper-proof data collection',
      'Community sensor guardians',
    ],
  },
  {
    icon: Brain,
    title: 'AI Analytics Engine',
    subtitle: 'Machine Learning Verification',
    description: 'Our proprietary AI models cross-validate satellite and ground data to deliver unmatched accuracy in carbon validation and anomaly detection.',
    features: [
      'Cross-data validation',
      'Anomaly detection',
      'Predictive modeling',
      'Automated compliance',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export const VerificationSection = () => {
  return (
    <section id="verification" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-forest-mid/30 to-background" />
      <div className="absolute inset-0 pattern-topo opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-forest-light/20 text-gold-warm text-sm font-medium mb-6">
            Three-Tiered Verification
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Setting a New{' '}
            <span className="text-gradient-gold">Global Standard</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our closed-loop verification system combines satellite data, ground-based IoT sensors, 
            and AI analytics to deliver unmatched accuracy in carbon validation.
          </p>
          <div className="section-divider mt-8" />
        </motion.div>

        {/* Verification Tiers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {verificationTiers.map((tier, index) => (
            <motion.div key={tier.title} variants={itemVariants}>
              <div className="verification-tier h-full">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-warm/20 to-gold-warm/5 flex items-center justify-center mb-6 animate-pulse-glow">
                  <tier.icon className="w-10 h-10 text-gold-warm" />
                </div>

                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-forest-light/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-gold-warm">{index + 1}</span>
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl text-foreground mb-2">{tier.title}</h3>
                <p className="text-gold-warm text-sm font-medium mb-4">{tier.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{tier.description}</p>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold-warm flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connection line between tiers */}
        <div className="hidden md:flex justify-center items-center mt-12">
          <div className="flex items-center gap-4">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-warm/50 to-gold-warm" />
            <div className="w-3 h-3 rounded-full bg-gold-warm" />
            <div className="w-32 h-0.5 bg-gold-warm/50" />
            <div className="w-3 h-3 rounded-full bg-gold-warm" />
            <div className="w-32 h-0.5 bg-gold-warm/50" />
            <div className="w-3 h-3 rounded-full bg-gold-warm" />
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold-warm via-gold-warm/50 to-transparent" />
          </div>
        </div>

        {/* Result callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-forest-mid/50 border border-gold-warm/20">
            <CheckCircle2 className="w-8 h-8 text-gold-warm" />
            <div className="text-left">
              <p className="font-display text-xl text-foreground">High-Integrity Verification</p>
              <p className="text-muted-foreground text-sm">Physics-backed carbon credits ready for global markets</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
