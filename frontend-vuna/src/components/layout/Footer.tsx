import { Satellite, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Dashboard', href: '#' },
    { label: 'Verification', href: '#verification' },
    { label: 'Projects', href: '#' },
    { label: 'VunaMap', href: '#' },
  ],
  services: [
    { label: 'Consultancy', href: '#' },
    { label: 'Carbon Audits', href: '#' },
    { label: 'MRV Integration', href: '#' },
    { label: 'Risk Assessment', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Team', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-forest-deep border-t border-forest-light/20 pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-warm to-gold-light flex items-center justify-center">
                <span className="font-display font-bold text-xl text-forest-deep">V</span>
              </div>
              <span className="font-display text-2xl font-semibold text-foreground">
                Vuna<span className="text-gold-warm">Verify</span>
              </span>
            </a>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Kenya's next-generation carbon credit verification platform, combining 
              satellite monitoring, IoT sensors, and AI analytics.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-gold-warm" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-gold-warm" />
                <span>hello@vunaverify.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-gold-warm" />
                <span>+254 700 000 000</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-gold-warm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-gold-warm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-gold-warm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-forest-light/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 VunaVerify. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-gold-warm transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-warm transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold-warm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
