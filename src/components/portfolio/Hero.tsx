import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Download, ArrowRight, BarChart3, LineChart, Activity, Database } from "lucide-react";
import profile from "@/assets/profile.jpg";

const roles = [
  "Data Analyst",
  "Automation Engineer",
  "Power BI Developer",
  "Data Science Student",
];

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = roles[i % roles.length];
    const speed = del ? 40 : 80;
    const t = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDel(true), 1200);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDel(false);
          setI((v) => v + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i]);

  return <span className="gradient-text cursor-blink">{text}</span>;
}

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* floating chart elements */}
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 left-6 md:left-20 glass rounded-2xl p-3 hidden sm:block">
        <BarChart3 className="w-6 h-6 text-primary" />
      </motion.div>
      <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-48 right-6 md:right-20 glass rounded-2xl p-3 hidden sm:block">
        <LineChart className="w-6 h-6 text-accent" />
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 left-10 md:left-32 glass rounded-2xl p-3 hidden sm:block">
        <Activity className="w-6 h-6 text-neon" />
      </motion.div>
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-32 right-10 md:right-32 glass rounded-2xl p-3 hidden sm:block">
        <Database className="w-6 h-6 text-primary" />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            Available for internships & collaborations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
            Hi, I'm <span className="gradient-text">Sivaram Krishna</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="mt-4 text-xl sm:text-2xl text-muted-foreground h-8">
            <Typewriter />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-6 text-muted-foreground max-w-xl leading-relaxed">
            Passionate Data Science student specializing in Data Analytics, Dashboard Development,
            Workflow Automation, and Real-Time Data Solutions using Excel, Power BI, Power Automate,
            SharePoint, and Python.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-bg text-primary-foreground font-medium glow-hover">
              View Projects <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-strong font-medium hover:bg-white/10 transition">
              <Download className="w-4 h-4" /> Download Resume
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass font-medium hover:bg-white/10 transition">
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-8 flex gap-3">
            {[
              { Icon: Github, href: "https://github.com" },
              { Icon: Linkedin, href: "https://linkedin.com" },
              { Icon: Mail, href: "mailto:sivaram@example.com" },
            ].map(({ Icon, href }, idx) => (
              <a key={idx} href={href} className="w-10 h-10 grid place-items-center rounded-xl glass hover:gradient-bg transition-all hover:scale-110">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 gradient-bg blur-3xl opacity-40 rounded-full" />
          <div className="relative glass-strong rounded-3xl p-3 animate-pulse-glow">
            <img src={profile} alt="Sivaram Krishna" width={768} height={768}
              className="w-full aspect-square object-cover rounded-2xl" />
            <div className="absolute -bottom-4 -left-4 glass-strong rounded-2xl p-3 flex items-center gap-2 animate-float">
              <div className="w-9 h-9 rounded-lg gradient-bg grid place-items-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Projects</div>
                <div className="font-bold">10+</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-strong rounded-2xl p-3 flex items-center gap-2 animate-float" style={{ animationDelay: "1s" }}>
              <div className="w-9 h-9 rounded-lg bg-neon/20 grid place-items-center">
                <Activity className="w-4 h-4 text-neon" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Experience</div>
                <div className="font-bold">2+ Yrs</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
