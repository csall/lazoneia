"use client";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: { value: "transparent" } },
        particles: {
          number: { value: 50 },
          size: { value: 3 },
          move: { speed: 1 },
          links: { enable: true, color: "#ffffff", distance: 150, opacity: 0.2 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "repulse" }, resize: true },
        },
      }}
    />
  );
}
