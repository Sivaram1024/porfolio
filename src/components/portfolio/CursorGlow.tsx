import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setVisible(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed z-[1] w-[400px] h-[400px] rounded-full blur-3xl opacity-30 transition-transform"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        background: "radial-gradient(circle, oklch(0.68 0.21 280 / 0.6), transparent 70%)",
      }}
    />
  );
}
