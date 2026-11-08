import React from 'react';
import { ShieldCheck, PackageCheck, CheckCircle2, Clock, MapPin, UserCheck, HeartHandshake, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export const StatsBand: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-white mx-auto mb-2" strokeWidth={2} />,
      value: '6+ Years',
      label: 'Trusted local delivery',
      desc: 'Serving families, merchants & clinics continuously since 2019.',
    },
    {
      icon: <PackageCheck className="w-8 h-8 text-white mx-auto mb-2" strokeWidth={2} />,
      value: '5,000+',
      label: 'Parcels delivered',
      desc: 'Handled with individual care directly without warehouse delays.',
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-white mx-auto mb-2" strokeWidth={2} />,
      value: '99.9%',
      label: 'Delivered without damage',
      desc: 'Direct point-to-point van transport with zero intermediate reshuffling.',
    },
    {
      icon: <Clock className="w-8 h-8 text-white mx-auto mb-2" strokeWidth={2} />,
      value: '98%',
      label: 'On-time delivery',
      desc: 'Dependable morning & afternoon schedules running every single day.',
    },
    {
      icon: <MapPin className="w-8 h-8 text-white mx-auto mb-2" strokeWidth={2} />,
      value: '15 Stops',
      label: 'Connected Regional Hubs',
      desc: 'Dedicated 65 km NH-752I corridor connecting Jalna, Watur, Partur & Mantha.',
    },
  ];

  const valuePillars = [
    {
      icon: <UserCheck className="w-6 h-6 text-[#EF8E01]" />,
      title: 'Direct Personal Contact',
      text: 'When you call or WhatsApp, you talk directly with the team who handles your parcel.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#EF8E01]" />,
      title: 'Pay on Arrival Trust',
      text: 'Pay only after your parcel arrives safely. Zero advance deposits needed.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#EF8E01]" />,
      title: 'Zero Mid-Sorting Delays',
      text: 'Direct ~48 km point-to-point highway transit instead of multi-day central depot routing.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-[#0038BD] text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EF8E01]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Continuous 5-Item Metrics Band with Staggered Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/20 text-center py-6"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`p-4 sm:p-6 flex flex-col items-center justify-center ${
                idx === 4 ? 'col-span-2 md:col-span-1 border-t md:border-t-0' : ''
              }`}
            >
              {stat.icon}
              <div className="text-3xl sm:text-4xl font-black text-[#EF8E01] tracking-tight mt-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-blue-100 mt-1 max-w-[160px]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3 Core Value Pillars */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-8 border-t border-white/15"
        >
          {valuePillars.map((pillar, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="p-3 rounded-xl bg-white/10 shrink-0">
                {pillar.icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">{pillar.title}</h4>
                <p className="text-xs text-blue-100/80 leading-relaxed">{pillar.text}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
