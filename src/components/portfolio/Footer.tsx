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
          {[
            { Icon: Github, href: "https://github.com/Sivaram1024", label: "GitHub Profile" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/sivaram2410/", label: "LinkedIn Profile" },
            { Icon: Mail, href: "mailto:sivaramkrishna2410@gmail.com", label: "Send Email" },
          ].map(({ Icon, href, label }, i) => (
            <a
              key={i}
              href={href}
              title={label}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-9 h-9 grid place-items-center rounded-lg glass hover:gradient-bg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_oklch(0.68_0.21_280/0.5)] group"
              aria-label={label}
            >
              <Icon className="w-4 h-4 group-hover:text-primary-foreground transition-colors" />
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
