import { SectionHeader, Reveal } from "./Section";
import { Calendar, FolderKanban, Cpu, Briefcase } from "lucide-react";

const stats = [
  { Icon: Calendar, label: "Years Learning", value: "3+" },
  { Icon: FolderKanban, label: "Projects Built", value: "10+" },
  { Icon: Cpu, label: "Technologies", value: "15+" },
  { Icon: Briefcase, label: "Internships", value: "2" },
];

const specialties = [
  "Excel Automation", "Power BI Dashboards", "Power Automate", "SharePoint",
  "Snowflake", "Python", "SQL",
];

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="About Me" title={<>Designing Data Solutions, <span className="gradient-text">Not Just Reports</span></>} />

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <div className="glass-strong rounded-3xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                I'm a <span className="text-foreground font-medium">B.Tech 3rd-year Data Science student</span> with
                strong problem-solving abilities and hands-on experience in Data Analytics,
                workflow automation, and dashboard development.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                I enjoy building intelligent systems that improve efficiency and automate
                real-world business processes — turning raw data into clear, actionable decisions.
              </p>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Specializations</div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <span key={s} className="px-3 py-1.5 text-xs rounded-full glass border border-white/10 hover:border-primary/50 transition">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ Icon, label, value }) => (
                <div key={label} className="glass rounded-2xl p-6 glow-hover">
                  <div className="w-10 h-10 rounded-xl gradient-bg grid place-items-center mb-4">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold gradient-text">{value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
