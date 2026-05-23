import { createFileRoute } from "@tanstack/react-router";
import Nav from "@/components/portfolio/Nav";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Certifications from "@/components/portfolio/Certifications";
import Achievements from "@/components/portfolio/Achievements";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import CursorGlow from "@/components/portfolio/CursorGlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sivaram Krishna — Data Analyst & Automation Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Sivaram Krishna, a B.Tech Data Science student specializing in Power BI dashboards, workflow automation, and real-time data solutions.",
      },
      { property: "og:title", content: "Sivaram Krishna — Data Analyst Portfolio" },
      { property: "og:description", content: "Data Analytics, Power BI, Power Automate, and automation portfolio." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen">
      <CursorGlow />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  );
}
