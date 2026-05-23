import { SectionHeader, Reveal } from "./Section";
import { motion } from "framer-motion";
import { Code2, BarChart3, Database, Wrench } from "lucide-react";

const categories = [
  {
    Icon: Code2,
    title: "Programming",
    skills: [
      { name: "Python", level: 90 },
      { name: "Java", level: 75 },
      { name: "C", level: 70 },
      { name: "HTML/CSS", level: 85 },
    ],
  },
  {
    Icon: BarChart3,
    title: "Data & Analytics",
    skills: [
      { name: "Excel", level: 95 },
      { name: "Power BI", level: 90 },
      { name: "Power Automate", level: 85 },
      { name: "SharePoint", level: 80 },
      { name: "Snowflake", level: 70 },
    ],
  },
  {
    Icon: Database,
    title: "Databases",
    skills: [
      { name: "MySQL", level: 85 },
      { name: "MongoDB", level: 75 },
    ],
  },
  {
    Icon: Wrench,
    title: "Tools",
    skills: [
      { name: "Git / GitHub", level: 88 },
      { name: "VS Code", level: 95 },
      { name: "Jupyter", level: 90 },
      { name: "Postman", level: 80 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Skills"
          title={<>My <span className="gradient-text">Tech Stack</span></>}
          subtitle="A toolkit honed across data analytics, automation, and full-stack tinkering."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <Reveal key={cat.title} delay={idx * 0.05}>
              <div className="glass-strong rounded-3xl p-6 h-full glow-hover">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl gradient-bg grid place-items-center">
                    <cat.Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{cat.title}</h3>
                </div>
                <div className="space-y-4">
                  {cat.skills.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>{s.name}</span>
                        <span className="text-muted-foreground">{s.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full gradient-bg rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
