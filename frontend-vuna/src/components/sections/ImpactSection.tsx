import { motion } from 'framer-motion';
import { Globe, Users, TrendingUp, Award, Trees, Shield } from 'lucide-react';

const impactStats = [
  { value: '$5→$30', label: 'Credit Value Increase', icon: TrendingUp },
  { value: '40%', label: 'Community Benefit Share', icon: Users },
  { value: '90%', label: 'Verification Accuracy', icon: Shield },
  { value: '2,847', label: 'Active IoT Sensors', icon: Globe },
];

const impactAreas = [
  {
    title: 'For Kenya',
    icon: Award,
    points: [
      'Regulatory compliance with Climate Change Act 2024',
      'Maximizes 40% community profit share through premium pricing',
      'Transitions Kenya from "junk credits" to high-integrity hub',
    ],
  },
  {
    title: 'For Global Markets',
    icon: Globe,
    points: [
      'Solves the liquidity crunch with verified supply',
      'Provides AI Paradox solution for tech giants (Microsoft, Google)',
      'Future-proofs with ESA FLEX mission readiness',
    ],
  },
  {
    title: 'For Communities',
    icon: Trees,
    points: [
      'Quadruples revenue through premium credit pricing',
      'Funds schools, clinics, and infrastructure',
      'Creates local jobs through sensor guardian programs',
    ],
  },
];

export const ImpactSection = () => {
  return (
    <section id="impact" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-forest-mid/20 to-background" />
      
      {/* Decorative circles */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gold-warm/5 blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-forest-light/10 blur-3xl" />

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
            Our Impact
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Unlocking Value for{' '}
            <span className="text-gradient-gold">Kenya & The World</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            By certifying premium, physics-verified credits, we transform carbon markets 
            while maximizing community benefits.
          </p>
          <div className="section-divider mt-8" />
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-forest-mid/40 border border-forest-light/20"
            >
              <stat.icon className="w-8 h-8 text-gold-warm mx-auto mb-4" />
              <div className="stat-highlight text-3xl md:text-4xl mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Areas */}
        <div className="grid md:grid-cols-3 gap-8">
          {impactAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-forest-mid/50 to-transparent border border-forest-light/20"
            >
              <div className="w-14 h-14 rounded-xl bg-gold-warm/10 flex items-center justify-center mb-6">
                <area.icon className="w-7 h-7 text-gold-warm" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-6">{area.title}</h3>
              <ul className="space-y-4">
                {area.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-warm mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-forest-mid/50 border border-gold-warm/20">
            <h3 className="font-display text-3xl text-foreground mb-4">
              Ready to Build Trust in Carbon Markets?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Join VunaVerify and access physics-backed verification for high-integrity carbon credits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="btn-hero">Get Started</a>
              <a href="#" className="btn-outline-light">Contact Us</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
