import { SectionHeader, Reveal } from "./Section";
import { Mail, Phone, Linkedin, Github, Send } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-bg blur-3xl opacity-10 rounded-full" />
      <div className="relative mx-auto max-w-5xl px-4">
        <SectionHeader
          eyebrow="Contact"
          title={<>Let's Build <span className="gradient-text">Data-Driven Solutions</span> Together</>}
          subtitle="Have a project, role, or idea in mind? Drop a message."
        />

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <Reveal>
            <div className="glass-strong rounded-3xl p-7 space-y-5 h-full">
              {[
                { Icon: Mail, label: "Email", value: "sivaram@example.com", href: "mailto:sivaram@example.com" },
                { Icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                { Icon: Linkedin, label: "LinkedIn", value: "/in/sivaram", href: "https://linkedin.com" },
                { Icon: Github, label: "GitHub", value: "@sivaram", href: "https://github.com" },
              ].map(({ Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl glass grid place-items-center group-hover:gradient-bg transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-medium group-hover:gradient-text transition">{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="glass-strong rounded-3xl p-7 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary transition text-sm" />
                <input required type="email" placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary transition text-sm" />
              </div>
              <input placeholder="Subject"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary transition text-sm" />
              <textarea required rows={5} placeholder="Tell me about your project..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary transition text-sm resize-none" />
              <motion.button
                type="submit" disabled={sending}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-bg text-primary-foreground font-medium glow-hover disabled:opacity-70">
                {sent ? "✓ Message Sent" : sending ? "Sending..." : <>Send Message <Send className="w-4 h-4" /></>}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
