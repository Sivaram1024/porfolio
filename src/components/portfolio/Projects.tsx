import { SectionHeader, Reveal } from "./Section";
import { useState } from "react";
import { ExternalLink, Github, Workflow, BarChart3 } from "lucide-react";

const projects = [
  {
    Icon: Workflow,
    title: "Internship Management System",
    category: "Automation",
    desc: "Automated internship workflow management system using Excel, SharePoint, Outlook, and Power Automate to streamline application approvals, notifications, and centralized tracking.",
    features: ["Automated approvals", "Email notifications", "Centralized tracking", "Faculty/student workflow"],
    stack: ["Excel", "SharePoint", "Power Automate", "Outlook"],
  },
  {
    Icon: BarChart3,
    title: "CodeRadar",
    category: "Analytics",
    desc: "Intelligent coding performance monitoring system that tracks student coding progress and automatically identifies performance gaps.",
    features: ["Dashboard analytics", "Ranking system", "Conditional formatting", "Automated alerts", "Comparative insights"],
    stack: ["Excel", "SharePoint", "Power Automate", "Outlook"],
  },
];

const filters = ["All", "Automation", "Analytics"];

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Projects"
          title={<>Featured <span className="gradient-text">Work</span></>}
          subtitle="Real-world systems where automation meets analytics."
        />

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filters.map((f) => (
            <button
              key={f} onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                active === f ? "gradient-bg text-primary-foreground" : "glass hover:bg-white/10"
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <article className="group glass-strong rounded-3xl overflow-hidden glow-hover h-full flex flex-col">
                <div className="relative h-48 grid-bg gradient-bg/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-transparent" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-20 h-20 rounded-2xl glass-strong grid place-items-center group-hover:scale-110 transition-transform">
                      <p.Icon className="w-9 h-9 text-foreground" />
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full glass border border-white/20">
                    {p.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>

                  <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full glass border border-white/10">{s}</span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3 pt-4 border-t border-white/5">
                    <a href="#" className="inline-flex items-center gap-2 text-sm gradient-text font-medium">
                      <ExternalLink className="w-4 h-4" /> Live
                    </a>
                    <a href="#" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Github className="w-4 h-4" /> Code
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
