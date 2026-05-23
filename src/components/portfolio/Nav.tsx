import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certificates" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className={`glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between`}>
          <a href="#hero" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg gradient-bg grid place-items-center text-sm">SK</span>
            <span className="gradient-text">Sivaram</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-primary-foreground text-sm font-medium glow-hover"
          >
            Hire Me
          </a>
          <button
            aria-label="menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 grid place-items-center rounded-lg glass"
          >
            <div className="space-y-1.5">
              <span className="block w-5 h-0.5 bg-foreground" />
              <span className="block w-5 h-0.5 bg-foreground" />
            </div>
          </button>
        </div>
        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-3 text-sm">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.header>
  );
}
