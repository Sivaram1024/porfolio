import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="py-10 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold">
          <span className="w-8 h-8 rounded-lg gradient-bg grid place-items-center text-sm">SK</span>
          <span className="gradient-text">Sivaram Krishna</span>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition">{l.label}</a>
          ))}
        </nav>
        <div className="flex gap-3">
          {[Github, Linkedin, Mail].map((Icon, i) => (
            <a key={i} href="#" className="w-9 h-9 grid place-items-center rounded-lg glass hover:gradient-bg transition">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-6">
        © {new Date().getFullYear()} Sivaram Krishna. Crafted with data & care.
      </div>
    </footer>
  );
}
