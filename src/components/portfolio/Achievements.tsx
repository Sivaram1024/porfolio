import { SectionHeader, Reveal } from "./Section";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Trophy, ShieldCheck, Zap, LayoutDashboard } from "lucide-react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const items = [
  { Icon: Trophy, num: 1, suffix: "", label: "Offered internship at Technical Hub" },
  { Icon: ShieldCheck, num: 1, suffix: "", label: "Government-recognized APSCHE Internship" },
  { Icon: Zap, num: 5, suffix: "+", label: "Real-time automation projects" },
  { Icon: LayoutDashboard, num: 8, suffix: "+", label: "Dashboards engineered" },
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="Achievements" title={<>Milestones & <span className="gradient-text">Wins</span></>} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div whileHover={{ y: -6 }} className="glass-strong rounded-2xl p-6 h-full text-center">
                <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto grid place-items-center mb-4 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                  <it.Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold gradient-text">
                  <Counter to={it.num} suffix={it.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-2">{it.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
