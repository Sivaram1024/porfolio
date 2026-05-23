import { SectionHeader, Reveal } from "./Section";
import { Award, ExternalLink } from "lucide-react";

const certs = [
  { org: "Deloitte", title: "Data Analytics Job Simulation", color: "from-emerald-500/40 to-teal-500/20" },
  { org: "IBM SkillsBuild", title: "Data Certificate", color: "from-blue-500/40 to-indigo-500/20" },
  { org: "Infosys Springboard", title: "Python Basics", color: "from-sky-500/40 to-cyan-500/20" },
  { org: "Oracle", title: "Generative AI OCI Certification", color: "from-red-500/40 to-orange-500/20" },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="Certifications" title={<>Verified <span className="gradient-text">Credentials</span></>} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certs.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="group glass-strong rounded-2xl p-6 h-full glow-hover">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center mb-4 border border-white/10`}>
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{c.org}</div>
                <div className="font-semibold leading-snug">{c.title}</div>
                <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-xs gradient-text font-medium opacity-0 group-hover:opacity-100 transition">
                  Verify <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
