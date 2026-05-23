import { SectionHeader, Reveal } from "./Section";
import { Briefcase, GraduationCap } from "lucide-react";

const items = [
  {
    Icon: Briefcase,
    role: "Data Specialist Intern",
    org: "Technical Hub Pvt. Ltd.",
    date: "May – June 2025",
    desc: "Worked on real-time data solutions, workflow automation, and analytics-driven process optimization to improve operational efficiency.",
    badges: ["Power Automate", "SharePoint", "Excel"],
  },
  {
    Icon: GraduationCap,
    role: "SmartInternz Internship Program",
    org: "APSCHE Recognized",
    date: "2024",
    desc: "Focused on Data Analytics with Tableau and developed interactive dashboard and visualization skills.",
    badges: ["Tableau", "Data Viz", "Analytics"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeader eyebrow="Experience" title={<>My <span className="gradient-text">Journey</span></>} />

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent md:-translate-x-1/2" />
          <div className="space-y-10">
            {items.map((it, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}>
                  <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
                    <div className="glass-strong rounded-2xl p-6 glow-hover inline-block text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl gradient-bg grid place-items-center">
                          <it.Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{it.role}</div>
                          <div className="text-xs text-muted-foreground">{it.org}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">{it.date}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {it.badges.map((b) => (
                          <span key={b} className="text-xs px-2.5 py-1 rounded-full glass border border-white/10">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full gradient-bg md:-translate-x-1/2 ring-4 ring-background" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
